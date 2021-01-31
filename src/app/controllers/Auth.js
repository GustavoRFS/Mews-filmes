import { Router } from 'express';
import userSchema from '../schemas/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = new Router();

function generateToken(userData) {
  return jwt.sign(userData, process.env.AUTH_SECRET, {});
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (name !== 'Bururu' && name !== 'Gururu') {
    return res.status(400).send({ error: 'Nome inválido' });
  }

  if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    return res.status(400).send({ error: 'Email inválido' });
  }

  const users = await userSchema.find();

  if (users.length === 2) {
    return res
      .status(400)
      .send({ error: 'Limite de usuários cadastrados alcançado' });
  }

  for (var i = 0; i < users.length; i++) {
    if (users[i].name == name) {
      var error;
      switch (name) {
        case 'Bururu':
          error = 'A Bururu já está cadastrada';
          break;
        case 'Gururu':
          error = 'O Gururu já está cadastrado';
      }
      return res.status(400).send({ error });
    }
  }

  const profilePic =
    name === 'Bururu'
      ? 'https://occ-0-3640-185.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABVxZC1U_c0igh0JcII8X33_OzC3KhpBESqQobnB65dVP6WKjwBpzkUQco8AZK1dIVKlSzlKp7-TtpRAObuGFWQG1Q1e6.png?r=564'
      : 'https://occ-0-3640-185.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABeteyZny9hQrqtM473Pl7cAUdPV90f5yx5NAC6VwvpzUsWAl54AbCyMbqPypoRrOJBmlArvhfAB-2hjyhYi0mOv7JybA.png?r=d36';

  userSchema
    .create({ name, email, password: bcrypt.hashSync(password), profilePic })
    .then(() => {
      return res.send({ message: 'Registrado com sucesso' });
    })
    .catch(() => {
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).send({ error: 'Email ou senha incorretos' });
  }

  userSchema
    .findOne({ email })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        return res.send({
          token: generateToken({
            uid: user._id,
            name: user.name,
          }),
        });
      } else {
        return res.status(400).send({ error: 'Email ou senha incorretos' });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.put('/image', AuthMiddleware, (req, res) => {
  const { profilePic } = req.body;
  if (!profilePic) {
    return res.status(400).send({ error: 'Nenhuma imagem inserida' });
  }

  userSchema
    .findOneAndUpdate({ name: req.name }, { profilePic })
    .then(() => {
      return res.send({ message: 'Imagem trocada com êxito' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

router.get('/user_data', AuthMiddleware, (req, res) => {
  userSchema
    .findById(req.uid)
    .lean()
    .exec()
    .then((user) => {
      if (user) {
        user.password = undefined;
        return res.send(user);
      } else {
        return res
          .status(400)
          .send({ error: 'Dados do usuário não encontrado' });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: 'Erro interno do servidor' });
    });
});

export default router;

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Auth, Movies } from '@/app/controllers';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send({ message: 'Bomdjea' });
});

app.use('/auth', Auth);
app.use('/movies', Movies);

app.listen(port, () => {
  console.log(`Servidor rodando no link http://localhost:${port}`);
});

export app;
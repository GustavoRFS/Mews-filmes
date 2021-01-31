import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'No valid token provided' });
  }
  const authData = authHeader.split(' ');
  if (authData.length !== 2 || authData[0] !== 'Bearer') {
    return res.status(401).send({ error: 'No valid token provided' });
  }

  jwt.verify(authData[1], process.env.AUTH_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ error: 'No valid token provided' });
    } else {
      req.uid = decoded.uid;
      req.name = decoded.name;
      next();
    }
  });
};

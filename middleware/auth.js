import jwt from 'jsonwebtoken';

async function auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Malformed token' });
    }

    const payload = jwt.verify(token, process.env.CLAVE_SECRETA);
    console.log(payload);

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized access' });
  }
}

export default auth;

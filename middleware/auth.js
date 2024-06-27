import jwt from "jsonwebtoken";

async function auth(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).send({ error: "No token provided" });
    }
    const payload = jwt.verify(token, process.env.CLAVE_SECRETA);
    console.log(payload);
    req.user = payload; // Guarda el payload en el request para usarlo en otro momento
    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized access" });
  }
}

export default auth;

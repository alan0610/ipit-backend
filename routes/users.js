import express from "express";
import { addUser, findByCredential, generateAuthToken, getProjects} from "../data/user.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
  try {
    const result = await addUser(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await findByCredential(req.body.email, req.body.password);

    // generar el token
    const token = await generateAuthToken(user);
    res.send({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});


//cada usuario va a tener en la db de mongo db un atributo de tipo array que se llama proyectos aca voy a devolver una lista de esos proyectos
usersRouter.get("/projects", async (req, res) => {
  try {
     const result = await getProjects(req.body);
     res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
export default usersRouter;

// export {router}

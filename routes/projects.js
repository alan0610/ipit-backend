import express from "express";
import auth from "../middleware/auth.js"; // Ajusta la ruta según la ubicación de tu middleware de autenticación
import { getProjects } from "../data/project.js";

const projectsRouter = express.Router();

//cada usuario va a tener en la db de mongo db un atributo de tipo array que se llama proyectos aca voy a devolver una lista de esos proyectos
projectsRouter.get("/", auth, async (req, res) => {
  try {
    const result = await getProjects(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
export default projectsRouter;

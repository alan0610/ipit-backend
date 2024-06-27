import express from "express";
import {
  addUser,
  findByCredential,
  generateAuthToken,
  getProjectbyUser,
  updateUserBalance,
  addProjectToUser,
  getProjectCost,
} from "../data/user.js";

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
    const user = await findByCredential(req.body.username, req.body.password); // Buscar el usuario
    const token = await generateAuthToken(user); // Generar el token
    res.send({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

usersRouter.get("/:id/projects", async (req, res) => {
  try {
    res.json(await getProjectbyUser(req.params.id));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

usersRouter.put("/invest", async (req, res) => {
  const { userId, projectId } = req.body; // Obtiene userId y projectId desde el cuerpo de la solicitud del lado del Front.

  try {
    const projectCost = await getProjectCost(projectId);
    await updateUserBalance(userId, projectCost, true); // Verificar si el usuario tiene saldo suficiente y actualiza el mismo.
    await addProjectToUser(userId, projectId); // Llama a la función para agregar el proyecto al usuario.

    res.status(200).json({ success: true, message: "Operación realizada" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

usersRouter.put("/balance", async (req, res) => {
  const { userId, amount } = req.body; // Obtiene userId y projectId desde el cuerpo de la solicitud del lado del Front.

  try {
    await updateUserBalance(userId, amount, false); // Actualiza el saldo del usuario.

    res.status(200).json({ success: true, message: "Operación realizada" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default usersRouter;

import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/projects", projectsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});

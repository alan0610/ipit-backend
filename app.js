import "dotenv/config";
import express from "express";
import cors from "cors";
import inventorRouter from "./routes/inventor.js";
import usersRouter from "./routes/users.js";

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/inventor", inventorRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});

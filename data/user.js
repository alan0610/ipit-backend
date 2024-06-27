import getConnection from "./connection.js";
import bcryptjs from "bcryptjs";
import e from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

/*    1) Añadir usuario    */
export async function addUser(user) {
  const clientmongo = await getConnection();

  // Comprueba si ya existe un usuario con esos datos en la db
  const userExists = await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ username: user.username });

  // Si no existe el usuario, se hashea la contraseña recibida
  if (!userExists) {
    user.password = await bcryptjs.hash(user.password, 10);

    // A continuación se inserta un nuevo usuario a la base de datos con la información indicada a continuación
    const result = await clientmongo.db("ipit").collection("users").insertOne({
      username: user.username,
      password: user.password,
      balance: 0, // Creamos una cartera de dinero para el usuario, luego el mismo podrá agregar dinero a la misma.
      projects: [], // Creamos una colección de proyectos para que el usuario pueda invertir en los mismos, y se guarde la información aca dentro.
    });

    return result;
  } else {
    throw new Error("Usuario ya existe");
  }
}

/*    2) Encontrar un usuario según credenciales (LOGIN)    */
export async function findByCredential(username, password) {
  const clientmongo = await getConnection();

  const user = await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ username: username });

  if (!user) {
    throw new Error("Credenciales no validas");
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Credenciales no validas");
  }

  return user;
}

/*    2) Encontrar un usuario según credenciales (LOGIN)    */
export async function generateAuthToken(user) {
  const token = await jwt.sign(
    { _id: user._id, username: user.username },
    process.env.CLAVE_SECRETA,
    { expiresIn: "1h" }
  );
  return token;
}

/*    2) Encontrar un usuario según credenciales (LOGIN)    */
export async function getProjectbyUser(userId) {
  const clientmongo = await getConnection();
  const user = await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error("Usuario Inexistente");
  }
  if (!user.projects) {
    return user;
  }

  const projects = [];
  for (const projectId of user.projects) {
    const project = await clientmongo
      .db("ipit")
      .collection("projects")
      .findOne({ _id: projectId });
    projects.push(project);
  }

  return projects;
}

/*    2) Encontrar un usuario según credenciales (LOGIN)    */
export async function getProjectCost(projectId) {
  const clientmongo = await getConnection();

  try {
    const project = await clientmongo
      .db("ipit")
      .collection("projects")
      .findOne({ _id: new ObjectId(projectId) });

    if (!project) {
      throw new Error("Proyecto no encontrado");
    }
    return project.cost_investment;
  } catch (error) {
    throw new Error(error.message);
  }
}

/*    2) Encontrar un usuario según credenciales (LOGIN)    */
export async function updateUserBalance(userId, amount, invest) {
  const clientmongo = await getConnection();

  try {
    // Busca al usuario y el proyecto
    const user = await clientmongo
      .db("ipit")
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error("Usuario Inexistente");
    }

    // Si invest es false, entonces estamos añadiendo saldo a la cartera del usuario; continua siendo una operatoria de adición.
    // Si invest es true, significa que tratamos con una solicitud de inversion, es decir que tenemos que restar el amount (del proyecto)
    if (invest === true) {
      if (user.balance < amount) {
        throw new Error("Saldo Insuficiente");
      } else {
        amount = -amount;
      }
    }

    // Actualiza el saldo del usuario
    const updatedUser = await clientmongo
      .db("ipit")
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $inc: { balance: amount } }, // $inc incrementar el amount al item balance
        { returnOriginal: false } // Devuelve el documento actualizado
      );

    return updatedUser.value; // Retorna el usuario actualizado con el nuevo saldo
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addProjectToUser(userId, projectId) {
  const clientmongo = await getConnection();

  const user = await clientmongo
    .db("ipit")
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { projects: new ObjectId(projectId) } }
    );

  return await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
}

export async function getUser(userId) {
  const clientmongo = await getConnection();

  const user = await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  return user;
}
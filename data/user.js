import getConnection from "./connection.js";
import bcryptjs from "bcryptjs";
import e from "express";
import jwt from "jsonwebtoken";

export async function addUser(user) {
  const clientmongo = await getConnection();

  // TODO Validar si el usuario existe YA LO HICE
  const userExists = await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ email: user.email });

  if (!userExists) {
    user.password = await bcryptjs.hash(user.password, 10);

    const result = await clientmongo
      .db("ipit")
      .collection("users")
      .insertOne(user);

    return result;
  } else {
    throw new Error("Usuario ya existe");
  }
}

export async function findByCredential(email, password) {
  const clientmongo = await getConnection();

  const user = await clientmongo
    .db("ipit")
    .collection("users")
    .findOne({ email: email });

  if (!user) {
    throw new Error("Credenciales no validas");
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Credenciales no validas");
  }

  return user;
}

export async function generateAuthToken(user) {
  const token = await jwt.sign(
    { _id: user._id, email: user.email },
    process.env.CLAVE_SECRETA,
    { expiresIn: "1h" }
  );
  return token;
}

export async function getProjects() {
  const clientmongo = await getConnection();
  const projects = await clientmongo
    .db("ipit")
    .collection("projects")
    .find()
    .toArray();
  return projects;
}



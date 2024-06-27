import getConnection from "./connection.js";
import bcryptjs from "bcryptjs";
import e from "express";
import jwt from "jsonwebtoken";

/*    Obtener el listado completo de proyectos en la db    */
export async function getProjects() {
  const clientmongo = await getConnection();
  const projects = await clientmongo
    .db("ipit")
    .collection("projects")
    .find()
    .toArray();
  return projects;
}

import { ObjectId } from "mongodb";
import getConnection from "./connection.js";

export async function getInventors() {
  const clientmongo = await getConnection();

  const inventors = await clientmongo
    .db("sample_tp2")
    .collection("inventors")
    .find()
    .toArray();

  return inventors;
}

export async function getInventor(id) {
  const clientmongo = await getConnection();

  const inventor = await clientmongo
    .db("sample_tp2")
    .collection("inventors")
    .findOne({ _id: new ObjectId(id) });

  return inventor;
}

export async function addInventor(inventor) {
  const clientmongo = await getConnection();

  const result = await clientmongo
    .db("sample_tp2")
    .collection("inventors")
    .insertOne(inventor);

  return result;
}

export async function updateInventor(inventor) {
  const clientmongo = await getConnection();
  const query = { _id: new ObjectId(inventor._id) };
  const newValues = {
    $set: {
      first: inventor.first,
      last: inventor.last,
      year: inventor.year,
    },
  };

  const result = await clientmongo
    .db("sample_tp2")
    .collection("inventors")
    .updateOne(query, newValues);
  return result;
}

export async function deleteInventor(id) {
  const clientmongo = await getConnection();

  const result = await clientmongo
    .db("sample_tp2")
    .collection("inventors")
    .deleteOne({ _id: new ObjectId(id) });
  return result;
}

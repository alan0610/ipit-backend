import express from "express";
import {
  getInventor,
  getInventors,
  addInventor,
  deleteInventor,
  updateInventor,
} from "../data/inventor.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const inventors = await getInventors();
  res.json(inventors);
});

router.get("/:id", auth, async (req, res) => {
  const inventor = await getInventor(req.params.id);
  res.json(inventor);
});

router.post("/", auth, async (req, res) => {
  const inventor = req.body;
  const result = await addInventor(inventor);
  res.json(result);
});

// router.put
// router.delete

export default router;

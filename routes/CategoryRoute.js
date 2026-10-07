import express from "express";

import {
  getKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} from "../controllers/kategoriController.js";

const router = express.Router();

router.get("/", getKategori);
router.get("/:id", getKategoriById);
router.post("/", createKategori);
router.put("/:id", updateKategori);
router.delete("/:id", deleteKategori);

export default router;
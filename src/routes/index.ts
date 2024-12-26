import express from "express";
import {
  addClient,
  updateClient,
  removeClient,
  getClientBySearch,
  getClientById,
} from "../controllers";

export const router = express.Router();

router.post("/", addClient);
router.patch("/:id", updateClient);
router.delete("/:id", removeClient);
router.get("/search", getClientBySearch);
router.get("/:id", getClientById);

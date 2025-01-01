import express from "express";
import {
  addClient,
  updateClient,
  removeClient,
  getClientBySearch,
  getClientById,
} from "../controllers/client";

export const client_routes = express.Router();

client_routes.post("/", addClient);
client_routes.patch("/:id", updateClient);
client_routes.delete("/:id", removeClient);
client_routes.get("/search", getClientBySearch);
client_routes.get("/:id", getClientById);

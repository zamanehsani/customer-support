import express from "express";
import {
  addClient,
  updateClient,
  removeClient,
  getClientBySearch,
  getClientById,
} from "../controllers/client";

import { authenticate, authorize } from "../middleware";

export const client_routes = express.Router();

client_routes.post("/", authenticate, authorize, addClient);
client_routes.patch("/:id", authenticate, authorize, updateClient);
client_routes.delete("/:id", authenticate, authorize, removeClient);
client_routes.get("/search", authenticate, authorize, getClientBySearch);
client_routes.get("/:id", authenticate, authorize, getClientById);

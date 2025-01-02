import express from "express";
import { addUser, login } from "../controllers/user";
import { authenticate, authorize } from "../middleware/index";

export const user_routes = express.Router();
user_routes.post("/", authenticate, authorize, addUser);
user_routes.post("/login", login);

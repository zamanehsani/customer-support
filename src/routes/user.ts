import express from "express";
import { addUser, login } from "../controllers/user";

export const user_routes = express.Router();
user_routes.post("/", addUser);
user_routes.post("/login", login);

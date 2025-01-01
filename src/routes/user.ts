import express from "express";
import { addUser } from "../controllers/user";

export const user_routes = express.Router();
user_routes.post("/", addUser);

// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { client_routes } from "./routes/client";
import { user_routes } from "./routes/user";
import { PrismaClient } from "@prisma/client";

import { admin_route } from "./utils/userAdmin";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Customer Support service running");
});

app.use("/admin", admin_route);
app.use("/support", client_routes);
app.use("/user", user_routes);

// connect to postgres
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log("Connected to postgres");
});

app.listen(port, () => {
  console.log(`CS service running on port ${port}`);
});

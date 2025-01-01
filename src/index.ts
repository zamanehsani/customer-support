// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { client_routes } from "./routes/client";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Customer Support service running");
});

app.use("/support", client_routes);

// connect to postgres
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log("Connected to postgres");
});

app.listen(port, () => {
  console.log(`CS service running on port ${port}`);
});

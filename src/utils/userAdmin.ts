import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export const admin_route = express.Router();

admin_route.post("/admin-user", async (req: Request, res: Response) => {
  try {
    // check if the user already exists
    const userCount = await prisma.users.count();
    if (userCount > 0) {
      res.status(400).json({ error: "Admin user already exists" });
    }

    // add a new user
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: ["admin"],
      },
    });
    res.status(201).json(user);
  } catch (error) {}
});

import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export const admin_route = express.Router();

admin_route.post("/", async (req: Request, res: Response) => {
  try {
    // check if the user already exists
    const userCount = await prisma.users.count();
    if (userCount > 0) {
      res.status(400).json({ error: "Admin user already exists" });
      // add the return after res so that the rest of the code does not run
      return;
    }
    if (!req.body) {
      res.status(400).json({ error: "Invalid Request, no data found!" });
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
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error adding admin user" });
  }
});

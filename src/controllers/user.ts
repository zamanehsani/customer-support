import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const addUser = async (req: Request, res: Response) => {
  // validate the request
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }
  // validate the token
  const token = auth.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "unauthorized, no token provided." });
  }

  //   validate the premissions
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decoded) {
    res.status(403).json({ error: "forbidden" });
  }

  try {
    const user = 0;
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

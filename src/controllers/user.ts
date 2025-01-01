import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    // first check if reqeust body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Please provide the user data");
    }
    // get the requst name, email, and password
    const { email, password } = req.body;

    console.log("req body is was not empty. continue...", email, password);
    // check if the email and password are provided
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }
    // check if the email is valid
    if (!email.includes("@")) {
      throw new Error("Please provide a valid email");
    }

    console.log("email and passwoue...");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

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

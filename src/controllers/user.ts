import { json, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import useragent from "useragent";
// import requestIp from "request-ip";

import { addLog } from "../utils/logs";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    // first check if reqeust body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Please provide the user data");
    }
    // get the requst name, email, and password
    const { email, password } = req.body;

    // check if the email and password are provided
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }
    /**
     * TODO: implement a better email validation
     */
    if (!email.includes("@")) {
      throw new Error("Please provide a valid email");
    }

    const userwithPass = await prisma.users.findUnique({
      where: { email },
    });

    // check the user password with the req.body password. user password is hashed
    if (!userwithPass) {
      throw new Error("user not found!");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      userwithPass.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...user } = userwithPass;
    // generate a token
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });

    // save a log as well
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"];

    const userAgent = req.headers["user-agent"];

    // add a log
    const log = await addLog({
      user: user.id,
      action: "user.login",
      details: user.email + " logged in",
      userAgent: userAgent + " " + ip,
    });

    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, roles } = req.body;
    if (!name || !email || !password || !phone || !roles) {
      res.status(400).json({ error: "Please provide all the required fields" });
      return;
    }

    // check if the email is not taken
    const userExists = await prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      res.status(400).json({ error: "Email already taken" });
      return;
    }
    const passwordHashed = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { name, email, password: passwordHashed, phone, roles },
    });

    // const user = 0;
    res.status(201).json(user);

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"];

    const userAgent = req.headers["user-agent"];

    // add a log
    const log = await addLog({
      user: user.id,
      action: "user.created",
      details: user.email + " created",
      userAgent: userAgent + " " + ip,
    });

    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

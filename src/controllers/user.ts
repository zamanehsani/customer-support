import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    // check if the email is valid
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
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
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
    const decodedToken = decoded as jwt.JwtPayload & { user: any };

    if (!decoded || !decodedToken.user) {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    // if inside decoded. user.roles includes "admin" then create the user

    if (!decodedToken.user?.roles.includes("admin")) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    console.log("creating user");

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

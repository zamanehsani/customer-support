import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  addClient as addClientService,
  updateClient as updateClientService,
  removeClient as removeClientService,
  getClientBySearch as getClientBySearchService,
  getClientById as getClientByIdService,
} from "../services/client";

const prisma = new PrismaClient();

export const addClient = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Please provide the client data." });
      return;
    }

    // validate the request
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).json({ error: "Not authorized" });
      return;
      // throw new Error("Not authorized");
    }
    // validate the token
    const token = auth.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided." });
      return;
    }

    //   validate the premissions
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const decodedToken = decoded as jwt.JwtPayload & { user: any };

    if (!decoded || !decodedToken.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // if inside decoded. user.roles includes "admin" then create the user
    if (!decodedToken.user?.roles.includes("admin")) {
      res.status(403).json({ error: "Not enough permissions" });
      return;
    }

    const { email, name } = req.body;
    if (!email || !name) {
      res.status(400).json({ error: "Please provide all the required fields" });
      return;
    }

    // check if the email is not taken
    const Exists = await prisma.clients.findUnique({
      where: { email },
    });

    if (Exists) {
      res.status(400).json({ error: "Email already taken" });
      return;
    }

    const user = await addClientService(req, res);

    /**
     * TODO: Add logs of client creation
     */

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await updateClientService(id, req.body);
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await removeClientService(id);
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const client = await getClientByIdService(id);
    if (!client) {
      return res.status(404).json({ message: "No client found" });
    }
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientBySearch = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const client = await getClientBySearchService(req.query);
    if (!client || client.length === 0) {
      console.log("No client found");
      return res.status(404).json({ message: "No client found" });
    }
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

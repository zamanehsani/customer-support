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

import { addLog } from "../utils/logs";

const prisma = new PrismaClient();

export const addClient = async (req: Request, res: Response) => {
  try {
    /** Please remove the validations, authorizations and authentications blocks from here
     * and use the middleware to handle them
     */
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Please provide the client data." });
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

    const client = await addClientService(req, res);
    res.status(201).json(client);

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"];

    const userAgent = req.headers["user-agent"];

    // add a log
    const log = await addLog({
      user: req?.user.id,
      action: "client.created",
      details: JSON.stringify(client),
      userAgent: userAgent + " " + ip,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    /** validations and authorizations */
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Please provide the client data." });
      return;
    }

    const { id } = req.params;
    const client = await updateClientService(id, req.body);
    res.json(client);

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"];

    const userAgent = req.headers["user-agent"];

    // add a log
    const log = await addLog({
      user: req.user.id,
      action: "client.updated",
      details: JSON.stringify(client),
      userAgent: userAgent + " " + ip,
    });

    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await removeClientService(id);

    res.json(client);

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"];

    const userAgent = req.headers["user-agent"];

    // add a log
    const log = await addLog({
      user: req.user.id,
      action: "client.removed",
      details: JSON.stringify(client),
      userAgent: userAgent + " " + ip,
    });

    return;
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
    /** validations and authorizations */
    if (!req.query || Object.keys(req.query).length === 0) {
      res.status(400).json({ error: "Please provide the client query." });
      return;
    }

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

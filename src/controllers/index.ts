import { Request, Response } from "express";
import {
  addClient as addClientService,
  updateClient as updateClientService,
  removeClient as removeClientService,
  getClientBySearch as getClientBySearchService,
  getClientById as getClientByIdService,
} from "../services";

export const addClient = async (req: Request, res: Response) => {
  try {
    const user = await addClientService(req.body);
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

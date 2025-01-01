import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const addClient = async (req: Request, res: Response) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined.");
    }
    const date = new Date();
    const isActive = true;

    const license = jwt.sign(
      {
        issue_date: date,
        isActive: isActive,
        email: req.body.email,
        name: req.body.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );

    const client = await prisma.clients.create({
      data: { license, ...req.body },
    });

    return client;
  } catch (error) {
    console.error("Error adding client:", error);
    throw new Error("Error adding client");
  }
};

export const updateClient = async (id: string, data: any) => {
  /**
   * add proper validation of id and data not being present.
   * or date and or time is not the right format.
   * or id is not found
   * then send proper error message to the front
   *
   */
  try {
    const client = await prisma.clients.update({
      where: { id },
      data,
    });
    return client;
  } catch (error) {
    console.error("Error updating client:", error);
    throw new Error("Error updating client");
  }
};

export const removeClient = async (id: string) => {
  // add the proper validate. if the id is not provided, or the id is not valide or not found in the
  // DB then send proper error message to the front.
  try {
    const client = await prisma.clients.delete({
      where: { id },
    });
    return client;
  } catch (error) {
    console.error("Error removing client:", error);
    throw new Error("Error removing client");
  }
};

export const getClientById = async (id: string) => {
  /**
   * as the same, valide the request
   */
  try {
    const client = await prisma.clients.findUnique({
      where: { id },
    });
    return client;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

export const getClientBySearch = async (query: any) => {
  try {
    const { name, email, phone, address } = query;

    const whereClause: any = {};

    if (!query || Object.keys(query).length === 0) {
      throw new Error("Please provide at least one search parameter.");
    }

    if (name) {
      whereClause.name = {
        contains: name as string,
        mode: "insensitive",
      };
    }
    if (email) {
      whereClause.email = {
        contains: email as string,
        mode: "insensitive",
      };
    }
    if (phone) {
      whereClause.phone = {
        contains: phone as string,
        mode: "insensitive",
      };
    }
    if (address) {
      whereClause.address = {
        contains: address as string,
        mode: "insensitive",
      };
    }

    const clients = await prisma.clients.findMany({
      where: whereClause,
    });

    if (!clients || clients.length === 0) {
      throw new Error("No cleints found");
    }

    return clients;
  } catch (error: any) {
    console.error("Error searching clients:", error);
    throw new Error(error.message);
  }
};

import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const addClient = async (req: any) => {
  try {
    // if data is not provided or not in the right format, send proper error message to the front
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Please provide the client data.");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    /**
     * TOOD:
     * 1. Validate the form data
     * 2. Add user and roles to the license
     * 3. Add expiration date to the license
     */
    const license = jwt.sign(
      { id: "user", role: "user.role" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );

    const client = await prisma.clients.create({
      data: { license, ...req.body },
    });

    // create a log entry
    // save a log record for the client creation as well
    /**
     * TODO:
     * 1. Add the user (based on ID) to the log record
     * 2. Add the user agent (the request details of ip, browser, etc)
     */
    await prisma.logs.create({
      data: {
        action: "client.created",
        details: `${client}`,
        user: "admin",
        clientId: client.id as string,
        userAgent: "user-agent",
      },
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

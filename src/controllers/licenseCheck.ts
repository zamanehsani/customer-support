import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const licenseCheck = async (req: Request, res: Response) => {
  try {
    const { client, details } = req.body;
    const license = await prisma.licenseCheck.create({
      data: {
        client,
        details,
      },
    });
    res.status(201).json({ status: "updated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

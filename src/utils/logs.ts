import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addLog = async (data: {
  user: string;
  action: string;
  details: string;
  userAgent: string;
}) => {
  try {
    /**
     * Get data from param and add a Logs entery
     */
    console.log("saving loggs....", data);
    const log = await prisma.logs.create({
      data,
    });
    return log;
  } catch (error) {
    return error;
  }
};

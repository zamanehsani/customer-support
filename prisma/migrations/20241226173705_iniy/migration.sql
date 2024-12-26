-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "logo" TEXT,
    "notes" TEXT,
    "users" TEXT,
    "departments" TEXT[],
    "valid_to" TIMESTAMP(3),
    "valid_from" TIMESTAMP(3),
    "WhatsApp" TEXT,
    "license" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSuspensed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" TEXT[],
    "photo" TEXT,
    "document" TEXT,
    "phone" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

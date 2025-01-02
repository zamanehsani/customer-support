-- CreateTable
CREATE TABLE "licenseCheck" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client" TEXT,
    "details" TEXT,

    CONSTRAINT "licenseCheck_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
CREATE TYPE "adapter_model" AS ENUM ('SUNTECH', 'GT06');

-- CreateEnum
CREATE TYPE "adapter_mobileOperator" AS ENUM ('Claro', 'Oi', 'Tim', 'Vivo', 'Vodafone', 'Outras');

-- CreateEnum
CREATE TYPE "adapter_timezone" AS ENUM ('GMT-14', 'GMT-13', 'GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4', 'GMT-3', 'GMT-2', 'GMT-1', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12');

-- CreateTable
CREATE TABLE "adapter" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" INTEGER NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "model" "adapter_model" NOT NULL,
    "equipmentNumber" BIGINT NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "mobileOperator" "adapter_mobileOperator" NOT NULL,
    "chipNumber" VARCHAR(25) NOT NULL,
    "timezone" "adapter_timezone" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "road" VARCHAR(100) NOT NULL,
    "suburb" VARCHAR(50) NOT NULL,
    "city" VARCHAR(30) NOT NULL,
    "state" VARCHAR(30) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "postcode" VARCHAR(9) NOT NULL,
    "country" VARCHAR(20) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "info" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "odometer" INTEGER,
    "power" DOUBLE PRECISION,
    "serial" INTEGER,
    "io" INTEGER,
    "mode" INTEGER,
    "hourMeter" INTEGER,
    "archive" SMALLINT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverTime" TIMESTAMP(0) NOT NULL,
    "fixTime" TIMESTAMP(0) NOT NULL,
    "satellite" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" INTEGER NOT NULL,
    "course" VARCHAR(10) NOT NULL,
    "cellId" VARCHAR(10) NOT NULL,
    "adapterId" VARCHAR(36),
    "address" VARCHAR(36),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blocked" BOOLEAN NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "charge" BOOLEAN NOT NULL,
    "ignition" BOOLEAN NOT NULL,
    "battery" DOUBLE PRECISION NOT NULL,
    "adapterId" VARCHAR(36),
    "info" VARCHAR(36),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location.address_unique" ON "location"("address");

-- CreateIndex
CREATE INDEX "FK_d605880251ccc50b4eab70d649a" ON "location"("adapterId");

-- CreateIndex
CREATE UNIQUE INDEX "status.info_unique" ON "status"("info");

-- CreateIndex
CREATE INDEX "FK_95b18f01abf3de7d708a8d1c7f3" ON "status"("adapterId");

-- AddForeignKey
ALTER TABLE "location" ADD FOREIGN KEY ("adapterId") REFERENCES "adapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD FOREIGN KEY ("address") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD FOREIGN KEY ("adapterId") REFERENCES "adapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD FOREIGN KEY ("info") REFERENCES "info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "Model" AS ENUM ('SUNTECH', 'GT06');

-- CreateEnum
CREATE TYPE "MobileOperator" AS ENUM ('Claro', 'Oi', 'Tim', 'Vivo', 'Vodafone', 'Outras');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('GMT-14', 'GMT-13', 'GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4', 'GMT-3', 'GMT-2', 'GMT-1', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12');

-- CreateTable
CREATE TABLE "Device" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" INTEGER NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "model" "Model" NOT NULL,
    "equipmentNumber" VARCHAR(15) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "mobileOperator" "MobileOperator" NOT NULL,
    "chipNumber" VARCHAR(25) NOT NULL,
    "timezone" "Timezone" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "odometer" INTEGER,
    "power" DOUBLE PRECISION,
    "serial" INTEGER,
    "io" VARCHAR(6),
    "mode" INTEGER,
    "hourMeter" INTEGER,
    "archive" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
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
    "speed" SMALLINT NOT NULL,
    "course" VARCHAR(10) NOT NULL,
    "cellId" VARCHAR(10) NOT NULL,
    "mcc" INTEGER,
    "mnc" INTEGER,
    "lac" INTEGER,
    "deviceId" VARCHAR(36) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blocked" BOOLEAN NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "charge" BOOLEAN,
    "ignition" BOOLEAN NOT NULL,
    "battery" REAL NOT NULL,
    "rssi" SMALLINT,
    "deviceId" VARCHAR(36) NOT NULL,
    "infoId" VARCHAR(36) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" VARCHAR(36) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emergency" VARCHAR(20),
    "event" VARCHAR(20),
    "alert" VARCHAR(20),
    "deviceId" VARCHAR(36) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
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
CREATE INDEX "Location.deviceId_index" ON "Location"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Status.infoId_unique" ON "Status"("infoId");

-- AddForeignKey
ALTER TABLE "Location" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

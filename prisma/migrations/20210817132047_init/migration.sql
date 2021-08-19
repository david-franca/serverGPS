-- CreateEnum
CREATE TYPE "Model" AS ENUM ('SUNTECH', 'GT06');

-- CreateEnum
CREATE TYPE "MobileOperator" AS ENUM ('Claro', 'Oi', 'Tim', 'Vivo', 'Vodafone', 'Outras');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('GMT-14', 'GMT-13', 'GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4', 'GMT-3', 'GMT-2', 'GMT-1', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12');

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
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
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
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
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
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
    "deviceId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "charge" BOOLEAN,
    "ignition" BOOLEAN NOT NULL,
    "battery" REAL NOT NULL,
    "rssi" SMALLINT,
    "deviceId" TEXT NOT NULL,
    "infoId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "emergency" VARCHAR(20),
    "event" VARCHAR(20),
    "alert" VARCHAR(20),
    "deviceId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "refreshToken" VARCHAR,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device.equipmentNumber_unique" ON "Device"("equipmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Device.chipNumber_unique" ON "Device"("chipNumber");

-- CreateIndex
CREATE INDEX "Device.equipmentNumber_chipNumber_index" ON "Device"("equipmentNumber", "chipNumber");

-- CreateIndex
CREATE INDEX "Location.deviceId_index" ON "Location"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Status_infoId_unique" ON "Status"("infoId");

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE INDEX "User.username_index" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Location" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

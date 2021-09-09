-- CreateEnum
CREATE TYPE "VehiclesType" AS ENUM ('Ambulância', 'Barco', 'Bitrem', 'Carro', 'Caminhão', 'Caminhonete', 'Caminhão Betoneira', 'Caminhão Pipa', 'Colheitadeira', 'Escavadeira', 'Moto', 'Motobomba', 'Motoniveladora', 'Ônibus', 'Pá Carregadora', 'Pessoa', 'Semáforo', 'Trator', 'Trator de Esteira', 'Outros');

-- CreateEnum
CREATE TYPE "TypeAddress" AS ENUM ('Residencial', 'Comercial', 'Outros');

-- CreateEnum
CREATE TYPE "States" AS ENUM ('Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goías', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraíma', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins');

-- CreateEnum
CREATE TYPE "Model" AS ENUM ('SUNTECH', 'GT06');

-- CreateEnum
CREATE TYPE "MobileOperator" AS ENUM ('Claro', 'Oi', 'Tim', 'Vivo', 'Vodafone', 'Outras');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('GMT-14', 'GMT-13', 'GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4', 'GMT-3', 'GMT-2', 'GMT-1', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'CLIENT', 'OPERATOR');

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
    "role" "Role" NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "cpfOrCnpj" VARCHAR(14) NOT NULL,
    "cellPhone" VARCHAR(11) NOT NULL,
    "landline" VARCHAR(10),
    "typeOfAddress" "TypeAddress" NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "number" VARCHAR(6) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "complement" VARCHAR(50),
    "state" "States" NOT NULL,
    "city" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "licensePlate" VARCHAR(8) NOT NULL,
    "type" "VehiclesType" NOT NULL,
    "deviceId" TEXT,
    "customerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "brand" VARCHAR(30),
    "model" VARCHAR(30),
    "color" VARCHAR(30),
    "year" INTEGER,
    "chassi" VARCHAR(17),
    "renavam" VARCHAR(11),
    "observation" VARCHAR(150),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "Customer.cpfOrCnpj_unique" ON "Customer"("cpfOrCnpj");

-- CreateIndex
CREATE INDEX "Customer.cpfOrCnpj_index" ON "Customer"("cpfOrCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle.licensePlate_unique" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle.chassi_unique" ON "Vehicle"("chassi");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle.renavam_unique" ON "Vehicle"("renavam");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_deviceId_unique" ON "Vehicle"("deviceId");

-- AddForeignKey
ALTER TABLE "Location" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

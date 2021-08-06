/*
  Warnings:

  - A unique constraint covering the columns `[equipmentNumber]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chipNumber]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Device.equipmentNumber_unique" ON "Device"("equipmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Device.chipNumber_unique" ON "Device"("chipNumber");

-- CreateIndex
CREATE INDEX "Device.equipmentNumber_chipNumber_index" ON "Device"("equipmentNumber", "chipNumber");

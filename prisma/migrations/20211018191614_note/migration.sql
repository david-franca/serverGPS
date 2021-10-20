-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "note" TEXT;

-- RenameIndex
ALTER INDEX "Status_infoId_unique" RENAME TO "Status.infoId_unique";

-- RenameIndex
ALTER INDEX "Vehicle_deviceId_unique" RENAME TO "Vehicle.deviceId_unique";

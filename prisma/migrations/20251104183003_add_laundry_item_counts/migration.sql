/*
  Warnings:

  - You are about to drop the column `dropDate` on the `Laundry` table. All the data in the column will be lost.
  - Added the required column `bagNumber` to the `Laundry` table without a default value. This is not possible if the table is not empty.
  - Made the column `pickupDate` on table `Laundry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Laundry" DROP COLUMN "dropDate",
ADD COLUMN     "bagNumber" TEXT NOT NULL,
ADD COLUMN     "bedsheets" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bottoms" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "others" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shirts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalItems" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "towels" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "pickupDate" SET NOT NULL,
ALTER COLUMN "pickupDate" SET DEFAULT CURRENT_TIMESTAMP;

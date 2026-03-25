/*
  Warnings:

  - A unique constraint covering the columns `[wardNo]` on the table `wards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `wards_wardNo_key` ON `wards`(`wardNo`);

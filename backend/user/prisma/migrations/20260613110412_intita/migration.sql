/*
  Warnings:

  - A unique constraint covering the columns `[productManagerId,categoryId]` on the table `product_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_permissions_productManagerId_categoryId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "product_permissions_productManagerId_categoryId_key" ON "product_permissions"("productManagerId", "categoryId");

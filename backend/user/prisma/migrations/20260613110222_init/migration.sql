-- DropIndex
DROP INDEX "product_permissions_productManagerId_categoryId_key";

-- CreateIndex
CREATE INDEX "product_permissions_productManagerId_categoryId_idx" ON "product_permissions"("productManagerId", "categoryId");

-- CreateTable
CREATE TABLE "product_permissions" (
    "id" TEXT NOT NULL,
    "productManagerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_permissions_productManagerId_categoryId_idx" ON "product_permissions"("productManagerId", "categoryId");

-- AddForeignKey
ALTER TABLE "product_permissions" ADD CONSTRAINT "product_permissions_productManagerId_fkey" FOREIGN KEY ("productManagerId") REFERENCES "product_managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_permissions" ADD CONSTRAINT "product_permissions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

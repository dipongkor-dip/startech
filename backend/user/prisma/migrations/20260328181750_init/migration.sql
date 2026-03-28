/*
  Warnings:

  - Made the column `name` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `customer_support_managers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `delivery_boys` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product_managers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `super_admins` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "customer_support_managers" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "delivery_boys" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_managers" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "super_admins" ALTER COLUMN "name" SET NOT NULL;

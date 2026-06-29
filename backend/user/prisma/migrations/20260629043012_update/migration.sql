/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerId]` on the table `auth_providers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_provider_providerId_key" ON "auth_providers"("provider", "providerId");

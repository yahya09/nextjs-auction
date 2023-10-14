/*
  Warnings:

  - Added the required column `owner_email` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "owner_email" VARCHAR NOT NULL,
ALTER COLUMN "status" SET DEFAULT '';

/*
  Warnings:

  - The primary key for the `auctions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `auctions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `biddings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `biddings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `auction_id` on the `biddings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `deposit_histories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `deposit_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "biddings" DROP CONSTRAINT "biddings_auction_id_fkey";

-- AlterTable
ALTER TABLE "auctions" DROP CONSTRAINT "auctions_pkey",
ALTER COLUMN "id" SET DATA TYPE int4,
ADD CONSTRAINT "auctions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "biddings" DROP CONSTRAINT "biddings_pkey",
ALTER COLUMN "id" SET DATA TYPE int4,
ALTER COLUMN "auction_id" SET DATA TYPE int4,
ADD CONSTRAINT "biddings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "deposit_histories" DROP CONSTRAINT "deposit_histories_pkey",
ALTER COLUMN "id" SET DATA TYPE int4,
ADD CONSTRAINT "deposit_histories_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "biddings" ADD CONSTRAINT "biddings_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "published_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "auctions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "starting_price" DOUBLE PRECISION NOT NULL,
    "time_window" SMALLINT NOT NULL,
    "last_bid_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR NOT NULL DEFAULT '''draft''',

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biddings" (
    "id" BIGSERIAL NOT NULL,
    "auction_id" BIGINT,
    "email" VARCHAR NOT NULL,
    "bid_amount" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "biddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_histories" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR NOT NULL,
    "initial_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ending_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposit_histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "biddings" ADD CONSTRAINT "biddings_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE;


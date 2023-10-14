import type {NextApiRequest, NextApiResponse} from 'next';
import {SupabaseClient} from "@supabase/supabase-js";
import {supabaseServerClient} from "@/utils/api/supabase";
import prisma from "@/utils/prisma";
import {BidStatus, DepositReason} from "@/utils/types/status";

type RequestData = {
    amount: number,
    auctionId: number
}

let supabase: SupabaseClient;

async function placeNewBid(data: RequestData, res: NextApiResponse) {
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        res.status(401).json({message: "You must login first to place a bid"});
        return;
    }
    const userEmail = user?.email || "";
    // Check if user has enough balance
    const userDeposit = await prisma.deposit_histories.findFirst({
        where: {
            email: userEmail
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    const userBalance = userDeposit?.ending_balance || 0;
    if (userBalance < data.amount) {
        res.status(403).json({message: "Insufficient balance. Please top up first!"});
        return;
    }
    // Check if bid is higher than last bid
    const auction = await prisma.auctions.findUniqueOrThrow({
        where: {
            id: data.auctionId
        }
    });
    const lastBidAmount = auction.last_bid_amount || auction.starting_price;
    if (data.amount <= lastBidAmount) {
        res.status(403).json({message: "Your bid must be higher than the last bid."});
        return;
    }
    // Check if auction is still open
    if (auction.status !== "PUBLISHED") {
        res.status(403).json({message: "This auction is no longer open for bidding."});
        return;
    }
    // Check if user is the owner of the auction
    if (auction.owner_email === userEmail) {
        res.status(403).json({message: "You cannot bid on your own auction."});
        return;
    }

    const newBidData = {
        email: userEmail,
        bid_amount: data.amount,
        auction_id: data.auctionId,
        status: BidStatus.PENDING
    };
    const createBid = prisma.biddings.create({data: newBidData});

    const updateAuction = prisma.auctions.update({
        where: {
            id: data.auctionId
        },
        data: {
            last_bid_amount: data.amount
        }
    });

    const createDepositHistory = prisma.deposit_histories.create({
        data: {
            email: userEmail,
            initial_balance: userBalance,
            amount: -data.amount,
            ending_balance: userBalance - data.amount,
            reason: DepositReason.BID
        }
    });

    await prisma.$transaction([createBid, updateAuction, createDepositHistory])
        .then(res => supabase.auth.updateUser({
            data: {deposit_balance: userBalance - data.amount}
        }));

    res.status(200).json(newBidData);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!supabase) {
        supabase = supabaseServerClient(req, res);
    }

    if (req.method == 'POST') {
        console.log("Processing bid..", req.body);
        await placeNewBid(req.body, res);
    } else {
        console.log("Not matching any handler..", req.url);
        res.status(405).json({message: "Method not allowed"});
    }
}

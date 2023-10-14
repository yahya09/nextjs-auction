import type {NextApiRequest, NextApiResponse} from 'next';
import {SupabaseClient} from "@supabase/supabase-js";
import {supabaseServerClient} from "@/utils/api/supabase";
import prisma from "@/utils/prisma";
import {AuctionStatus} from "@/utils/types/status";


let supabase: SupabaseClient;

async function publishAuction(auctionId: number, res: NextApiResponse) {
    const {data: {user}} = await supabase.auth.getUser();
    const auction = await prisma.auctions.findUnique({
        where: {
            id: auctionId
        }
    });
    if (!auction) {
        res.status(404).json({message: "Auction not found"});
        return;
    }
    if (auction.status != AuctionStatus.DRAFT) {
        res.status(400).json({message: "Auction already published or completed!"});
        return;
    }
    if (auction.owner_email !== user?.email) {
        res.status(403).json({message: "User not allowed to publish this auction"});
        return;
    }
    const now = Date.now();
    const result = await prisma.auctions.update({
        data: {
            status: AuctionStatus.PUBLISHED,
            last_bid_amount: auction.starting_price,
            published_at: new Date(now),
            finished_at: new Date(now + auction.time_window * 60 * 60 * 1000),
        },
        where: {
            id: auction.id
        }
    });

    res.status(200).send(result);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!supabase) {
        supabase = supabaseServerClient(req, res);
    }

    const auctionId = parseInt(`${req.query.id}`);
    if (req.method == 'POST') {
        await publishAuction(auctionId, res);
    } else {
        res.status(405).json({message: "Method not allowed"});
    }
}

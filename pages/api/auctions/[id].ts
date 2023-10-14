import type {NextApiRequest, NextApiResponse} from 'next';
import {SupabaseClient} from "@supabase/supabase-js";
import {supabaseServerClient} from "@/utils/api/supabase";
import prisma from "@/utils/prisma";
import {AuctionStatus} from "@/utils/types/status";


let supabase: SupabaseClient;

async function getAuction(auctionId: number, res: NextApiResponse) {
    const result = await prisma.auctions.findUnique({
        where: {
            id: auctionId
        }
    });

    if (!result) {
        res.status(404).json({message: "Auction not found"});
        return;
    }

    res.status(200).json(result);
}

async function updateAuction(auctionId: number, requestData: any, res: NextApiResponse) {
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
        res.status(400).json({message: "Auction is not in draft status!"});
        return;
    }
    if (auction.owner_email !== user?.email) {
        res.status(403).json({message: "User not allowed to edit this auction"});
        return;
    }

    const result = await prisma.auctions.update({
        data: {
            name: requestData.name,
            starting_price: parseFloat(requestData.starting_price),
            time_window: parseInt(requestData.time_window),
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
    const { id } = req.query;
    console.log("API.auctionId", id);
    const auctionId = parseInt(`${id}`);
    if (req.method == 'GET') {
        await getAuction(auctionId, res);
    } else if (req.method == 'PUT') {
        await updateAuction(auctionId, req.body, res);
    } else {
        res.status(405).json({message: "Method not allowed"});
    }
}

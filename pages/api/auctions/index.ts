import type { NextApiRequest, NextApiResponse } from 'next';
import {SupabaseClient} from "@supabase/supabase-js";
import {supabaseServerClient} from "@/utils/api/supabase";
import prisma from "@/utils/prisma";
import {AuctionStatus} from "@/utils/types/status";

type FilterQuery = {
    page?: number,
    perPage?: number,
    status?: string,
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 1000;
const DEFAULT_STATUS = AuctionStatus.PUBLISHED;

let supabase: SupabaseClient;

async function getAuctionList(data: FilterQuery, res: NextApiResponse) {
  const page = data.page || DEFAULT_PAGE;
  const perPage = data.perPage || DEFAULT_PER_PAGE;
  const status = data.status || DEFAULT_STATUS;
  const whereQuery : any = {status};
  if (status == AuctionStatus.DRAFT) {
    const {data: {user}} = await supabase.auth.getUser();
    whereQuery['owner_email'] = user?.email || "";
  }
  console.log("whereQuery", whereQuery);
  const result = await prisma.auctions.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: whereQuery
  });
  const total = await prisma.auctions.count({where: whereQuery});

  res.status(200).json({
    data: result,
    page: page,
    perPage: perPage,
    totalPage: Math.ceil(total / perPage),
  });
}

async function createAuction(body: any, res: NextApiResponse) {
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    const result = await prisma.auctions.create({
        data: {
          name: body.name,
          time_window: parseInt(body.time_window),
          starting_price: parseFloat(body.starting_price),
          status: AuctionStatus.DRAFT,
          last_bid_amount: 0,
          owner_email: `${user.email}`,
        }
    });

    res.status(201).json(result);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  if (!supabase) {
    supabase = supabaseServerClient(req, res);
  }

  if (req.method == 'GET') {
    await getAuctionList(req.query as FilterQuery, res);
  } else if (req.method == 'POST') {
    await createAuction(req.body, res);
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}

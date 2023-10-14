// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {SupabaseClient} from "@supabase/supabase-js";
import {supabaseServerClient} from "@/utils/api/supabase";
import prisma from "@/utils/prisma";
import {DepositReason} from "@/utils/types/status";

type RequestData = {
  amount: number
}

let supabase: SupabaseClient;

async function storeNewDeposit(data: RequestData, res: NextApiResponse) {
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    res.status(401).json({message: "You must login first to deposit"});
  }

  const initialBalance = user?.user_metadata.deposit_balance || 0;
  const endingBalance = initialBalance + data.amount;

  const result = await prisma.deposit_histories.create({
    data: {
      email: user?.email || "",
      initial_balance: initialBalance,
      ending_balance: endingBalance,
      amount: data.amount,
      reason: DepositReason.DEPOSIT
    }
  });

  await supabase.auth.updateUser({
    data: {deposit_balance: result.ending_balance}
  });

  res.status(200).send({balance: result.ending_balance});
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  if (!supabase) {
    supabase = supabaseServerClient(req, res);
  }
  console.log("Request method?", req.method);
  if (req.method == 'POST') {
    console.log("Processing deposit..", req.body);
    await storeNewDeposit(req.body, res);
  } else {
    console.log("Not matching any handler..", req.url);
    res.status(405).json({message: "Method not allowed"});
  }
}

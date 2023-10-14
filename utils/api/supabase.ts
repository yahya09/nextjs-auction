import {createPagesServerClient} from "@supabase/auth-helpers-nextjs";
import {NextApiRequest, NextApiResponse} from "next";


export const supabaseServerClient = (req: NextApiRequest, res: NextApiResponse) => createPagesServerClient({req, res});
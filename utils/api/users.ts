import {supabaseServerClient} from "@/utils/api/supabase";
import {NextApiRequest, NextApiResponse} from "next";
import {User} from "@supabase/gotrue-js";

export async function getCurrentUser(req: NextApiRequest, res: NextApiResponse, refresh: boolean = false): Promise<User | undefined | null> {
    if (refresh) {
        const {data: {user}} = await supabaseServerClient(req, res).auth.getUser();
        return user;
    } else {
        const {data} = await supabaseServerClient(req, res).auth.getSession();
        return data.session?.user;
    }
}

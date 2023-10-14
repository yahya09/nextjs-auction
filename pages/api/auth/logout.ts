import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentUser} from "@/utils/api/users";
import {supabaseServerClient} from "@/utils/api/supabase";

export type UserCredential = {
    email: string,
    password: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != 'POST') {
        res.status(400).json({message: "Oops!"});
    }

    const user = await getCurrentUser(req, res);
    if (!user) {
        res.status(400).json({message: "No user logged in!"});
    }

    const {error} = await supabaseServerClient(req, res).auth.signOut();

    if (error) {
        console.log(`Logout error: `, error);
        res.status(400).json({message: "Can't let you go, sorry!"});
    } else {
        res.status(200).send('');
    }
}

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
    const userCredential = req.body;
    if (req.method != 'POST' || !userCredential) {
        res.status(400).json({message: "Email & password is required"});
    }

    const user = await getCurrentUser(req, res);
    if (user) {
        res.status(400).json({message: "User already logged in!"});
    }

    const {error} = await supabaseServerClient(req, res).auth.signInWithPassword(userCredential);

    if (error) {
        console.log(`Login for ${req.body} error: `, error);
        var message = error.message || "Email or password is wrong!";
        res.status(400).json({message});
    } else {
        res.status(200).json({});
    }
}

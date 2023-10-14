import {NextApiRequest, NextApiResponse} from "next";
import {UserCredential} from "@/pages/api/auth/login";
import {getCurrentUser} from "@/utils/api/users";
import {supabaseServerClient} from "@/utils/api/supabase";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userCredential = req.body as UserCredential;

    if (req.method != 'POST' || !userCredential) {
        res.status(400).json({message: "Email & password is required"});
    }

    const user = await getCurrentUser(req, res);
    if (user) {
        res.status(400).json({message: "User already logged in!"});
    }

    const { error } = await supabaseServerClient(req,res).auth.signUp({
        ...userCredential,
        options: {
            data: {
                deposit_balance: 0
            }
        }
    });

    if (error) {
        console.log(`Register failed for ${userCredential.email}. Error: `, error);
        const message = error.message || "Can't register with provided email/password, please try again!";
        res.status(400).json({message});
    } else {
        res.status(201).send('');
    }
}

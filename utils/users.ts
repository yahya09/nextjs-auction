import {supabase} from "@/utils/supabase";


export async function getCurrentUser(refresh: boolean = false) {
    if (refresh) {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } else {
        const {data} = await supabase.auth.getSession();
        return data.session?.user;
    }
}
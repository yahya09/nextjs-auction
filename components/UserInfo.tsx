import Typography from "@mui/material/Typography";
import {Chip, Tooltip} from "@mui/material";
import {AccountBalanceWallet} from "@mui/icons-material";
import {formatNumber} from "@/utils/money";
import * as React from "react";
import {useEffect} from "react";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

type UserInfoProps = {
    userBalance: number;
    //onBalanceChange: (newBalance: number) => void;
}

export default function UserInfo(props: UserInfoProps) {
    let { userBalance } = props;
    const supabase = useSupabaseClient();
    let user = useUser();
    const userAlias = user?.email?.split("@")[0] || "";
    const balance: number = user?.user_metadata.deposit_balance || userBalance;
    const [localBalance, setLocalBalance] = React.useState(balance);

    useEffect(() => {
        supabase.auth.refreshSession().then(res => {
            console.log('auth refreshed..');
            user = res.data.user;
            //onBalanceChange(user?.user_metadata.deposit_balance || userBalance);
            setLocalBalance(user?.user_metadata.deposit_balance || userBalance);
        });
    }, [userBalance]);

    return <>
        <Typography variant="body1" component="span">
            Hey, <strong>{userAlias}</strong>!
        </Typography>
        <Tooltip title={"Your deposit balance"} arrow sx={{ml: 1}}>
            <Chip icon={<AccountBalanceWallet />} label={<strong>${formatNumber(localBalance,2)}</strong>} variant="outlined" />
        </Tooltip>
    </>;
}
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import * as React from "react";
import Button from "@mui/material/Button";
import {Logout} from "@mui/icons-material";
import {Tooltip} from "@mui/material";

export default function LogoutButton() {
    const supabase = useSupabaseClient();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await supabase.auth.signOut();
    };
    return (
    <form method="post" onSubmit={handleSubmit}>
      <Button variant="outlined" sx={{my: 1, mx: 1.5}} type="submit">
          <Tooltip title={"Logout"}>
            <Logout fontSize="medium" />
          </Tooltip>
      </Button>
    </form>
  );
}

import {Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import * as React from "react";
import {auctions} from "@prisma/client";
import Link from "@mui/material/Link";
import {useUser} from "@supabase/auth-helpers-react";

type AuctionFormProps = {
    onSubmit: (formData: FormData, auctionId?: number) => void;
    auction?: auctions;
}

export default function AuctionForm(props: AuctionFormProps) {
    const {onSubmit, auction} = props;
    const user = useUser();

    if (auction && auction.status != "DRAFT") {
        return <div>
            <h1>Cannot edit an auction that is not in draft status!</h1>
            <Link href={`/`}>Back to home</Link>
        </div>;
    }
    if (auction && auction.owner_email != user?.email) {
        return <div>
            <h1>You&apos;re not allowed to edit this auction.</h1>
            <Link href={`/`}>Back to home</Link>
        </div>;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const timeWindow = parseInt(`${data.get('time_window')}`);
        if (isNaN(timeWindow) || timeWindow < 1) {
            alert("Time duration must be greater than zero!");
            return;
        }
        const startingPrice = parseInt(`${data.get('starting_price')}`);
        if (isNaN(startingPrice) || startingPrice < 0) {
            alert("Starting price must be greater than zero!");
            return;
        }

        onSubmit(data, parseInt(`${auction?.id}`));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    required
                    id="itemName"
                    name="name"
                    label="Item name"
                    type="text"
                    fullWidth
                    variant="standard"
                    defaultValue={auction?.name}
                />
                <TextField
                    required
                    id="itemPrice"
                    name="starting_price"
                    label="Starting price (USD)"
                    type="number"
                    fullWidth
                    variant="standard"
                    defaultValue={auction?.starting_price}
                />
                <TextField
                    required
                    id="itemduration"
                    name="time_window"
                    label="Auction time duration (in hour)"
                    type="number"
                    fullWidth
                    sx={{step: 1, min: 1, max: 24 * 7}}
                    variant="standard"
                    defaultValue={auction?.time_window}
                />
                <Grid container justifyContent="center">
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Save draft
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
        </form>
    );
}
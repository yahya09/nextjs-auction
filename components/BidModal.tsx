import {Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle} from "@mui/material";
import {formatNumber} from "@/utils/money";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from "react";
import {auctions} from "@prisma/client";

type BidModalProps = {
    auctionItem?: auctions;
    lastBid?: number;
    onCancel: () => void;
    onSuccess: (auctionId: number, bidAmount: number) => void;
}

export default function BidModal(props: DialogProps & BidModalProps) {
    const {open, onClose, auctionItem, lastBid, onCancel, onSuccess} = props;
    const lastBidAmount = lastBid || 0;

    const handlePlaceBid = () => {
        const field = document.getElementById("bidAmount") as HTMLInputElement;
        const amount = Number.parseFloat(field.value);
        if (amount <= lastBidAmount) {
            alert("Amount must be greater than last bid!");
            return false;
        }

        fetch("/api/bid", {
            method: "POST",
            body: JSON.stringify({amount, auctionId: auctionItem?.id}),
            headers: { "Content-Type": "application/json" }
        }).then(async response => {
            const data = await response.json();
            if (response.ok) {
                field.value = '';
                onSuccess(data.auction_id, data.bid_amount);
            } else {
                alert(data.message || "New bid failed, please try again later!");
            }
        });
    };

    return <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Place a new bid</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <strong>{auctionItem?.name}</strong> last bid:&nbsp;<strong>${formatNumber(lastBidAmount)}</strong>
                <br/>
                Place your new bid (must be greater than last bid):
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin="dense"
                id="bidAmount"
                label="Bid Amount"
                type="number"
                fullWidth
                variant="standard"
                inputProps={{min: lastBidAmount + 1}}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={handlePlaceBid} variant="contained" color="warning">Bid</Button>
        </DialogActions>
    </Dialog>;
}
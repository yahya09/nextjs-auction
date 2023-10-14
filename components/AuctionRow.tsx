import {Chip, TableCell, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {auctions} from ".prisma/client";
import {formatTime} from "@/utils/display";
import {useEffect} from "react";
import {AuctionStatus} from "@/utils/types/status";

type AuctionRowProps = {
    item: auctions,
    onOpenBid: (item: auctions) => void;
    disableBid: boolean;
    onDraftPublished?: (item: auctions) => void;
}


export default function AuctionRow(props: AuctionRowProps) {
    const {item: auctionItem, onOpenBid, disableBid, onDraftPublished} = props;
    const finishedAt = auctionItem.finished_at as unknown as string;
    const initialTimeLeft = auctionItem.status == AuctionStatus.DRAFT ?
        auctionItem.time_window * 3600 :
        Math.ceil((Date.parse(finishedAt) - Date.now()) / 1000);
    const onBidClick = () => onOpenBid(auctionItem);
    const [countdownTimer, setCountdownTimer] = React.useState<number>(initialTimeLeft);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (countdownTimer > 0) {
            interval = setInterval(() => {
                setCountdownTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);


    const handlePublish = () => {
        if (confirm("Are you sure you want to publish this auction?")) {
            fetch(`/api/auctions/${auctionItem.id}/publish`, {
                method: "POST"
            }).then(async response => {
                if (response.ok) {
                    alert("Auction published successfully!");
                    if (onDraftPublished) {
                        onDraftPublished(auctionItem);
                    }
                } else {
                    const body = await response.json();
                    alert(body.message || "Publish auction failed, please try again!");
                }
            });
        }
    };

    return <TableRow
        key={auctionItem.name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell component="th" scope="row">
            {auctionItem.name}
        </TableCell>
        <TableCell align="center">{auctionItem.last_bid_amount}</TableCell>
        <TableCell align="center">
            {initialTimeLeft > 0 ? <Typography variant="body1">{formatTime(initialTimeLeft)}</Typography> : <Chip label={"Expired"} />}
        </TableCell>
        <TableCell align="right">
            {auctionItem.status == AuctionStatus.COMPLETED && <Chip label={"Completed"} />}
            {auctionItem.status == AuctionStatus.DRAFT &&
                <>
                    <Button variant="contained" color="primary" onClick={handlePublish} sx={{mr:1}}>Publish</Button>
                    <Button variant="contained" color="secondary" href={`/auction/${auctionItem.id}`}>Edit</Button>
                </>
            }
            {auctionItem.status == AuctionStatus.PUBLISHED &&
                <Button variant="contained" disabled={disableBid || initialTimeLeft <= 0} color="success"
                        onClick={onBidClick}>Bid</Button>
            }
        </TableCell>
    </TableRow>;
}
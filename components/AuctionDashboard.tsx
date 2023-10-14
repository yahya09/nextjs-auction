import * as React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AuctionListFilters from "@/components/AuctionListFilters";
import {useEffect} from "react";
import {auctions} from "@prisma/client";
import AuctionRow from "@/components/AuctionRow";
import BidModal from "@/components/BidModal";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {AuctionStatus} from "@/utils/types/status";

type AuctionDashboardProps = {
    onNewBid: (bidAmount: number) => void;
}

const getNewAuctionChangeListener = (statusQuery: AuctionStatus, setRows: any) => {
    return (payload: any) => {
        const newAuction = payload.new;
        console.log("Auction changed", newAuction, statusQuery);
        setRows((rows: any) => {
            console.log("Auction changed", newAuction.id, newAuction.status);
            const oldAuction = rows.find((row: any) => row.id == newAuction.id);
            if (!oldAuction && newAuction.status == statusQuery) {
                return [...rows, newAuction];
            }
            if (oldAuction && newAuction.status != statusQuery) {
                return rows.filter((row: any) => row.id != newAuction.id);
            }

            return [...rows];
        });
    };
};

export default function AuctionDashboard(props: any) {
    const {onNewBid} = props;
    const supabase = useSupabaseClient();
    const user = useUser();
    let [rows, setRows] = React.useState<auctions[]>([]);
    let [openBid, setOpenBid] = React.useState(false);
    let [selectedItem, setSelectedItem] = React.useState<auctions>();
    let initialDisabledBids : {[key: string]: boolean} = {};
    rows.forEach(row => {
        initialDisabledBids[row.id.toString()] = row.status == AuctionStatus.COMPLETED;
    });
    let [disableBids, setDisableBids] = React.useState(initialDisabledBids);
    const [statusQuery, setStatusQuery] = React.useState(AuctionStatus.PUBLISHED);
    const handleFilterChange = (newStatus: AuctionStatus) => {
        setStatusQuery(newStatus);
    };

    const closeBidModal = () => setOpenBid(false);
    const handleNewBid = (auctionId: number, bidAmount: number) => {
        setOpenBid(false);
        onNewBid(bidAmount);
        // Disable bid button for 5 seconds
        const newDisableBids = {...disableBids};
        newDisableBids[auctionId.toString()] = true;
        setDisableBids(newDisableBids);

        setTimeout(() => {
            const restoreDisableBids = {...disableBids};
            restoreDisableBids[auctionId.toString()] = false;
            setDisableBids(restoreDisableBids);
        }, 5000);
    };
    const openNewBid = (item: auctions) => {
        if (!user) {
            alert("Please login to place a bid!");
            return;
        }
        if (item.owner_email == user.email) {
            alert("You cannot bid on your own item!");
            return;
        }
        setSelectedItem(item);
        setOpenBid(true);
    };

    const newBidListener = (payload: any) => {
        const newBid = payload.new;
        console.log("New bid", newBid);
        setRows(prevRows => {
            return prevRows.map(row => {
                if (row.id === newBid.auction_id) {
                    return {...row, last_bid_amount: newBid.bid_amount};
                }
                return row;
            });
        });
    };

    useEffect(() => {
        let newBidChannel: any;
        if (statusQuery == AuctionStatus.PUBLISHED) {
            newBidChannel = supabase.channel('new-bid-changes')
                .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'biddings'}, newBidListener)
                .subscribe();
        }
        const auctionUpdatedChannel = supabase.channel('auction-updated-channel')
            .on(
                'postgres_changes',
                {event: 'UPDATE', schema: 'public', table: 'auctions'},
                getNewAuctionChangeListener(statusQuery, setRows)
            )
            .subscribe();

        console.log("Channel subscribed", statusQuery);
        return () => {
            if (!!newBidChannel) {
                supabase.removeChannel(newBidChannel);
            }
            supabase.removeChannel(auctionUpdatedChannel);
            console.log("Channel removed");
        };
    }, [statusQuery]);

    useEffect(() => {
        fetch("/api/auctions?status=" + statusQuery).then(res => res.json()).then(data => {
            setRows(data.data);
        });
    }, [statusQuery]);

    return <TableContainer component={Paper}>
        <Grid container>
            <Grid item sx={{py: 1, px: 1, flexGrow: 1}}>
                <AuctionListFilters statusQuery={statusQuery} onFilterChange={handleFilterChange} showDraftOption={!!user} />
            </Grid>
            <Grid item sx={{py: 1, px: 1}}>
                {!!user &&
                    <Button href="/auction" variant="contained" color="primary">+ New Auction Item</Button>
                }
            </Grid>
        </Grid>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell><h3>Name</h3></TableCell>
                    <TableCell align="center"><h3>Last Bid</h3></TableCell>
                    <TableCell align="center"><h3>Time Left</h3></TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <AuctionRow item={row} key={row.id} onOpenBid={openNewBid} disableBid={disableBids[row.id.toString()]} />
                ))}
            </TableBody>
        </Table>
        <BidModal
            open={openBid}
            auctionItem={selectedItem}
            lastBid={selectedItem?.last_bid_amount}
            onCancel={closeBidModal}
            onSuccess={handleNewBid}
        />
    </TableContainer>;
}
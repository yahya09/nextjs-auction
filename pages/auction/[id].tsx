import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import GlobalStyles from "@mui/material/GlobalStyles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LogoutButton from "@/components/LogoutButton";
import Copyright from "@/components/Copyright";
import AuctionForm from "@/components/AuctionForm";
import {useEffect, useState} from 'react';
import {useRouter} from "next/router";


const defaultTheme = createTheme();

export default function Page(props: any) {
    const user = useUser();
    useSupabaseClient().auth.getUser().then((response) => {
        console.log("user", response.data.user?.email);
    }, (error) => {
        if (typeof window !== "undefined") {
            console.log("no user? redirecting to login");
            window.location.replace("/");
        }
    });

    const router = useRouter();
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log("router.ready", router.isReady);
        if (!router.isReady) {
            return;
        }
        fetch('/api/auctions/' + router.query.id)
            .then(async (res) => {
                const response = await res.json();
                if (!res.ok) {
                    throw new Error(response.message);
                }
                return response;
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            }, (reason) => {
                router.replace("/");
            });
    }, [router.query]);

    const handleSubmit = async (formData: FormData, auctionId?: number) => {
        if (!auctionId) {
            alert("Invalid auction id!");
            return;
        }
        await fetch("/api/auctions/" + auctionId, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: formData.get('name'),
                starting_price: formData.get('starting_price'),
                time_window: formData.get('time_window'),
            })
        }).then(async response => {
            if (response.ok) {
                alert("Auction saved!");
                window.location.href = "/";
            } else {
                const body = await response.json();
                alert(body.message || "Update auction failed, please try again!");
            }
        });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <GlobalStyles styles={{ul: {margin: 0, padding: 0, listStyle: 'none'}}}/>
            <CssBaseline/>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{borderBottom: (theme) => `1px solid ${theme.palette.divider}`}}
            >
                <Toolbar sx={{flexWrap: 'wrap'}}>
                    <Typography variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
                        Jitera Auction
                    </Typography>
                    <nav>
                        <Button
                            variant="contained"
                            href="/"
                            sx={{my: 1, mx: 1.5}}
                        >
                            &lt; Back to home
                        </Button>
                    </nav>
                    {!!user && <LogoutButton />}
                </Toolbar>
            </AppBar>
            <Container disableGutters maxWidth="sm" component="main" sx={{pt: 6, pb: 4}}>
                <Typography
                    component="h1"
                    variant="h3"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Edit auction item
                </Typography>
            </Container>
            <Container maxWidth="md" component="main">
                {isLoading && <p>Loading...</p>}
                {!isLoading && !data && <p>No auction data</p>}
                {!isLoading && data && <AuctionForm auction={data} onSubmit={handleSubmit} />}
            </Container>
            {/* Footer */}
            <Container
                maxWidth="md"
                component="footer"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: [3, 6],
                }}
            >
                <Copyright sx={{mt: 1}}/>
            </Container>
            {/* End footer */}
        </ThemeProvider>
    );
}
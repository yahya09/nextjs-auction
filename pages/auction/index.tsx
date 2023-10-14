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

    const handleSubmit = async (formData: FormData) => {
        await fetch("/api/auctions", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: formData.get('name'),
                starting_price: formData.get('starting_price'),
                time_window: formData.get('time_window'),
            })
        }).then(async response => {
            if (response.ok) {
                alert("Auction created successfully!");
                window.location.href = "/";
            } else {
                const body = await response.json();
                alert(body.message || "Create auction failed, please try again!");
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
                    Create new auction item
                </Typography>
            </Container>
            <Container maxWidth="md" component="main">
                <AuctionForm onSubmit={handleSubmit} />
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
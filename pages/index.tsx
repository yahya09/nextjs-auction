import {Inter} from 'next/font/google';
import {useSession, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import StarIcon from "@mui/icons-material/StarBorder";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import * as React from "react";
import Copyright from "@/components/Copyright";
import LogoutButton from "@/components/LogoutButton";
import {Chip, Tooltip} from "@mui/material";
import {AccountBalanceWallet, LocalAtm} from "@mui/icons-material";
import {formatNumber} from "@/utils/money";
import DepositModal from "@/components/DepositModal";
import {useEffect} from "react";
import UserInfo from "@/components/UserInfo";
import AuctionDashboard from "@/components/AuctionDashboard";

const inter = Inter({subsets: ['latin']});
const defaultTheme = createTheme();
const tiers = [
    {
        title: 'Free',
        price: '0',
        description: [
            '10 users included',
            '2 GB of storage',
            'Help center access',
            'Email support',
        ],
        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
    },
    {
        title: 'Pro',
        subheader: 'Most popular',
        price: '15',
        description: [
            '20 users included',
            '10 GB of storage',
            'Help center access',
            'Priority email support',
        ],
        buttonText: 'Get started',
        buttonVariant: 'contained',
    },
    {
        title: 'Enterprise',
        price: '30',
        description: [
            '50 users included',
            '30 GB of storage',
            'Help center access',
            'Phone & email support',
        ],
        buttonText: 'Contact us',
        buttonVariant: 'outlined',
    },
];
const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: [
            'Cool stuff',
            'Random feature',
            'Team feature',
            'Developer stuff',
            'Another one',
        ],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

export default function Home() {
    const user = useUser();
    const [userBalance, setUserBalance] = React.useState(0);
    const [openDeposit, setOpenDeposit] = React.useState(false);
    const handleOpenDeposit = () => {
        setOpenDeposit(true);
    };
    const handleCloseDeposit = () => {
        setOpenDeposit(false);
    };
    const handleNewDeposit = (newAmount: number) => {
        setUserBalance(newAmount);
        setOpenDeposit(false);
    };
    const handleNewBid = (bidAmount: number) => {
        setUserBalance(prevBalance => prevBalance - bidAmount);
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
                    {!user &&
                        <Button href="/login" variant="contained" sx={{my: 1, mx: 1.5}}>
                            Login
                        </Button>
                    }
                    {user && <>
                        <nav>
                            <UserInfo userBalance={userBalance} />
                            <Button
                                variant="contained"
                                onClick={handleOpenDeposit}
                                color="warning"
                                sx={{my: 1, mx: 1.5}}
                            >
                                + Add&nbsp;<LocalAtm fontSize="medium" />
                            </Button>
                        </nav>
                        <LogoutButton />
                    </>}
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
                    Auction Start!
                </Typography>
            </Container>
            <Container maxWidth="md" component="main">
                <Grid container>
                    <AuctionDashboard onNewBid={handleNewBid} />
                </Grid>
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
            <DepositModal
                open={openDeposit}
                onClose={handleCloseDeposit}
                onCancel={handleCloseDeposit}
                onSuccess={handleNewDeposit}
                depositBalance={userBalance} />
        </ThemeProvider>
    );
}

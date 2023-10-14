import {Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle} from "@mui/material";
import {formatNumber} from "@/utils/money";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from "react";

type DepositModalProps = {
    depositBalance: number;
    onCancel: () => void;
    onSuccess: (newAmount: number) => void;
}

export default function DepositModal(props: DialogProps & DepositModalProps) {
    const {open, onClose, depositBalance, onCancel, onSuccess} = props;

    const handleAddDeposit = () => {
        const field = document.getElementById("topupAmount") as HTMLInputElement;
        const amount = Number.parseFloat(field.value);
        if (amount <= 0) {
            alert("Amount must be greater than 0!");
            return false;
        }

        fetch("/api/deposit", {
            method: "POST",
            body: JSON.stringify({amount}),
            headers: { "Content-Type": "application/json" }
        }).then(async response => {
            if (response.ok) {
                field.value = '';
                const data = await response.json();
                onSuccess(data.balance);
            } else {
                const body = await response.json();
                alert(body.message || "Add deposit failed, please try again later!");
            }
        });
    };

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Deposit Balance</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Current balance: <strong>${formatNumber(depositBalance, 2)}</strong>
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin="dense"
                id="topupAmount"
                label="Topup Amount"
                type="number"
                fullWidth
                variant="standard"
                inputProps={{min: 1}}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={handleAddDeposit} variant="contained" color="warning">Add</Button>
        </DialogActions>
    </Dialog>;
}
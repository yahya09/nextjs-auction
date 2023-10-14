import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from "@mui/material/Typography";
import {AuctionStatus} from "@/utils/types/status";

type AuctionListFiltersProps = {
    onFilterChange: (newFilter: AuctionStatus) => void;
    statusQuery: AuctionStatus;
    showDraftOption: boolean;
}

export default function AuctionListFilters(props: AuctionListFiltersProps) {
    const {onFilterChange, statusQuery, showDraftOption} = props;

    const handleFilter = (
        event: React.MouseEvent<HTMLElement>,
        newStatus: AuctionStatus | null,
    ) => {
        if (newStatus !== null) {
            onFilterChange(newStatus);
        }
    };

    return (
        <ToggleButtonGroup
            value={statusQuery}
            exclusive
            onChange={handleFilter}
            aria-label="text alignment"
        >
            <ToggleButton value={AuctionStatus.PUBLISHED}>
                <Typography variant="button">Ongoing</Typography>
            </ToggleButton>
            <ToggleButton value={AuctionStatus.COMPLETED}>
                <Typography variant="button">Completed</Typography>
            </ToggleButton>
            {showDraftOption &&
                <ToggleButton value={AuctionStatus.DRAFT}>
                    <Typography variant="button">My Draft</Typography>
                </ToggleButton>
            }
        </ToggleButtonGroup>
    );
}
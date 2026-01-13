import React, {JSX} from "react";
import {InputBase, Paper, useMediaQuery, useTheme} from "@mui/material";
import {CancelRounded} from "@mui/icons-material";

interface OperationFilterProps {
    filterValue: string | null;
    onFilterChange: (value: string) => void;
    placeholder?: string;
}

/**
 * Composant de filtre pour les opérations
 * @param {OperationFilterProps} props - Les propriétés du composant
 * @returns {JSX.Element} - Le composant JSX du filtre
 */
const OperationFilter: React.FC<OperationFilterProps> = ({ 
    filterValue, 
    onFilterChange, 
    placeholder = "Filtrage des opérations" 
}: OperationFilterProps): JSX.Element => {
    
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(event.target.value);
    };

    const handleClearFilter = () => {
        onFilterChange("");
    };

    return (
        <Paper 
            component="form"
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                paddingRight: "10px"
            }}>
            <InputBase
                sx={{ ml: 1, flex: 1, color: "#808080" }}
                placeholder={placeholder}
                inputProps={{ 'aria-label': placeholder }}
                onChange={handleInputChange}
                value={filterValue}
                size={isMobile ? "small" : "medium"}
            />
            <CancelRounded 
                sx={{
                    color: "#D0D0D0",
                    cursor: "pointer",
                    width: isMobile ? "16px" : "20px",
                    height: isMobile ? "16px" : "20px"
                }}
                onClick={handleClearFilter}
            />
        </Paper>
    );
};

export default OperationFilter;

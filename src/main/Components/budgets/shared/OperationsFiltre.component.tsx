import React, {JSX, useRef} from "react";
import {IconButton, InputBase, Paper, useMediaQuery, useTheme} from "@mui/material";
import {CancelRounded} from "@mui/icons-material";

interface OperationsFiltreProps {
    filterValue: string | null;
    onFilterChange: (value: string) => void;
    placeholder?: string;
}

/**
 * Composant de filtre pour les opérations
 * @param {OperationsFiltreProps} props - Les propriétés du composant
 * @returns {JSX.Element} - Le composant JSX du filtre
 */
const OperationsFiltre: React.FC<OperationsFiltreProps> = ({
    filterValue,
    onFilterChange,
    placeholder = "Filtrage des opérations"
}: OperationsFiltreProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(event.target.value);
    };

    const handleClearFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onFilterChange("");
        inputRef.current?.focus();
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
                inputRef={inputRef}
                sx={{ ml: 1, flex: 1, color: "#808080" }}
                placeholder={placeholder}
                inputProps={{ 'aria-label': placeholder }}
                onChange={handleInputChange}
                value={filterValue}
                size={isMobile ? "small" : "medium"}
            />
            <IconButton
                aria-label="Effacer le filtre"
                onClick={handleClearFilter}
                size={isMobile ? "small" : "medium"}
                sx={{
                    width: 44,
                    height: 44,
                    color: "#D0D0D0"
                }}
            >
                <CancelRounded
                    sx={{
                        width: isMobile ? "16px" : "20px",
                        height: isMobile ? "16px" : "20px"
                    }}
                />
            </IconButton>
        </Paper>
    );
};

export default OperationsFiltre;

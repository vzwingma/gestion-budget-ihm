import React, { JSX } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { getTypeCategorieRenderer } from "../../../Utils/renderers/OperationItem.renderer.tsx";
import { TYPES_CATEGORIES_OPERATION_ENUM } from "../../../Utils/AppBusinessEnums.constants.ts";

interface TooltipSyntheseProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

/**
 * Custom tooltip for TreeMap visualization
 * Displays category/subcategory name, percentage, total amount, and number of transactions
 */
const AnalyseSyntheseTooltip = ({ active, payload, label }: TooltipSyntheseProps): JSX.Element => {
    if (!active || !payload || payload.length === 0) {
        return <></>;
    }
    const { name, value } = payload[0];

    return (
        <Box
            sx={{
                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                color: 'white',
                padding: 2,
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
        >
            <Typography 
                variant="subtitle1" 
                sx={{ 
                    fontWeight: 600, 
                    marginBottom: 1,
                    color: getTypeCategorieRenderer(name as TYPES_CATEGORIES_OPERATION_ENUM).color
                }}
            >
                {getTypeCategorieRenderer(name as TYPES_CATEGORIES_OPERATION_ENUM).text}
            </Typography>
            <Divider sx={{ marginBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Pourcentage :</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                        {value?.toFixed(2)}%
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AnalyseSyntheseTooltip;

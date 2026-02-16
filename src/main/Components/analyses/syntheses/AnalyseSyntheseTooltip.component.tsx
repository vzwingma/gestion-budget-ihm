import React, { JSX } from "react";
import { Box, Typography } from "@mui/material";
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
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        fontWeight: 600,
                        color: getTypeCategorieRenderer(name as TYPES_CATEGORIES_OPERATION_ENUM).color
                    }}
                >
                    {getTypeCategorieRenderer(name as TYPES_CATEGORIES_OPERATION_ENUM).text}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                    : {value?.toFixed(2)}%
                </Typography>
            </Box>
    );
};

export default AnalyseSyntheseTooltip;

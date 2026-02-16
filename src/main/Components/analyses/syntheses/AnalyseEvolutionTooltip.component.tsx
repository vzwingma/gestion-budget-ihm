import React, { JSX } from "react";
import { Box, Typography, Divider } from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer.tsx";

interface TooltipEvolutionProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}


/**
 * Custom tooltip for TreeMap visualization
 * Displays category/subcategory name, percentage, total amount, and number of transactions
 */
const AnalyseEvolutionTooltip = ({ active, payload, label }: TooltipEvolutionProps): JSX.Element => {
    if (!active || !payload || payload.length === 0) {
        return <></>;
    }
    // Filtrer les items avec valeur 0
    const filteredPayload = payload
        .filter((entry: any) => entry.value !== 0)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

    if (filteredPayload.length === 0) {
        return null;
    }

    return (
        <Box sx={{
                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                color: 'white',
                padding: 2,
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}>
            <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, marginBottom: 1, color: 'white' }}>
                {label}
            </Typography>

            <Divider sx={{ marginBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {filteredPayload.map((entry: any) => (
                    <Box key={entry.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                            sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '2px', 
                                backgroundColor: entry.color,
                                flexShrink: 0
                            }} 
                        />
                        <Typography variant="body2" sx={{ color: entry.color }}>
                            {entry.name} :
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'white', marginLeft: 2 }}>
                        <OperationValue valueOperation={entry.value.toFixed(2)} showSign={true} id={`${entry.dataKey}.VALUE`} />
                    </Typography>
                </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AnalyseEvolutionTooltip;

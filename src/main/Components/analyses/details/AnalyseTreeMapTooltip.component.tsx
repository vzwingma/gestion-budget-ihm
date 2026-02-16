import React, { JSX } from "react";
import { Box, Typography, Divider } from "@mui/material";

interface TooltipTreeMapProps {
    active?: boolean;
    payload?: any[];
}

/**
 * Custom tooltip for TreeMap visualization
 * Displays category/subcategory name, percentage, total amount, and number of transactions
 */
const AnalyseTreeMapTooltip = ({ active, payload }: TooltipTreeMapProps): JSX.Element => {
    if (!active || !payload || payload.length === 0) {
        return <></>;
    }

    const data = payload[0]?.payload;
    if (!data) {
        return <></>;
    }

    const { name, size, total, nbTransactions } = data;

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
                    color: 'white'
                }}
            >
                {name}
            </Typography>
            
            <Divider sx={{ marginBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Pourcentage :
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                        {size?.toFixed(2)}%
                    </Typography>
                </Box>
                
                {total !== undefined && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Montant :
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 500, 
                                color: total >= 0 ? '#4caf50' : '#f44336'
                            }}
                        >
                            {total?.toFixed(2)} €
                        </Typography>
                    </Box>
                )}
                
                {nbTransactions !== undefined && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Transactions :
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                            {nbTransactions}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AnalyseTreeMapTooltip;

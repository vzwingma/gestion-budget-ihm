import React, { JSX, useMemo, useState } from "react";
import { AnalyseCategoriesListeProps } from "../../Components.props.ts";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AnalyseTreeMapContent from "./AnalyseTreeMapContent.component.tsx";
import AnalyseTreeMapTooltip from "./AnalyseTreeMapTooltip.component.tsx";
import { useAnalyseTreeMapData } from "./AnalyseTreeMap.controller.ts";



const AnalyseTreeMap: React.FC<AnalyseCategoriesListeProps> = ({ analyseCategories: analyseCategoriesData }): JSX.Element => {

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    /**
     * Transform analyse categories data into treemap format
     */
    const { treemapData, selectedCategoryName } = useAnalyseTreeMapData(
        analyseCategoriesData,
        selectedCategoryId
    );

    /**
     * Handle click on a category to drill down
     */
    const handleCategoryClick = (categoryId: string | undefined) => {
        if (categoryId) {
            setSelectedCategoryId(categoryId);
        }
    };

    /**
     * Reset to show all categories
     */
    const handleBackToAll = () => {
        setSelectedCategoryId(null);
    };

    if (!treemapData || treemapData.length === 0) {
        return (
            <div style={{ 
                width: '100%', 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px'
            }}>
                Aucune donnée à afficher
            </div>
        );
    }

    return (
        <Box sx={{ width: '100%', height: '430px' }}>
            {/* Breadcrumb navigation */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, px: 1 }}>
                <Link
                    component="button"
                    onClick={handleBackToAll}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        color: selectedCategoryName ? 'primary.main' : 'text.primary',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}>
                    <HomeIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                </Link>
                {selectedCategoryName && (
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        {selectedCategoryName}
                    </Typography>
                )}
            </Breadcrumbs>

            {/* Treemap visualization */}
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={treemapData as any}
                        dataKey="size"
                        stroke="#fff"
                        content={(props: any) => (
                            <AnalyseTreeMapContent 
                                {...props} 
                                onClick={!selectedCategoryName && props.categoryId 
                                    ? () => handleCategoryClick(props.categoryId) 
                                    : undefined
                                }
                            />
                        )}
                        isAnimationActive={true}
                        animationDuration={300}>
                        <Tooltip content={<AnalyseTreeMapTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </Box>
    );
};

export default AnalyseTreeMap;

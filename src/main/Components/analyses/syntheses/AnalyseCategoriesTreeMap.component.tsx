import React, { JSX, useMemo, useState } from "react";
import { AnalyseCategoriesListeProps } from "../../Components.props.ts";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AnalyseTreeMapContent from "./AnalyseTreeMapContent.component.tsx";
import AnalyseTreeMapTooltip from "./AnalyseTreeMapTooltip.component.tsx";
import { NoDataComponent } from "../../shared/NoDataComponent.tsx";


interface TreemapNode {
    name: string;
    size: number;
    color: string;
    total?: number;
    nbTransactions?: number;
    categoryId?: string;
    children?: TreemapNode[];
    [key: string]: any; // Index signature for recharts compatibility
}


const AnalyseCategoriesTreeMap: React.FC<AnalyseCategoriesListeProps> = ({ analyseCategories: analyseCategoriesData }): JSX.Element => {

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    /**
     * Transform analyse categories data into treemap format
     */
    const { treemapData, selectedCategoryName } = useMemo(() => {
        if (!analyseCategoriesData || analyseCategoriesData.length === 0) {
            return { treemapData: [], selectedCategoryName: null };
        }

        const allCategories = analyseCategoriesData
            .filter(cat => cat.pourcentage > 0)
            .map(categoryData => {
                const children: TreemapNode[] = Object.values(categoryData.resumesSsCategories || {})
                    .filter(sscat => sscat.pourcentage > 0)
                    .map(ssCategoryData => ({
                        name: ssCategoryData.ssCategorie.libelle,
                        size: ssCategoryData.pourcentage,
                        color: ssCategoryData.couleurSsCategorie,
                        total: ssCategoryData.total,
                        nbTransactions: ssCategoryData.nbTransactions
                    }));

                return {
                    name: categoryData.categorie.libelle,
                    size: categoryData.pourcentage,
                    color: categoryData.couleurCategorie,
                    total: categoryData.total,
                    nbTransactions: categoryData.nbTransactions,
                    categoryId: categoryData.categorie.id,
                    children: children.length > 0 ? children : undefined
                };
            })
            .sort((a, b) => b.size - a.size);

        // If a category is selected, show only its subcategories
        if (selectedCategoryId) {
            const selectedCategory = allCategories.find(cat => cat.categoryId === selectedCategoryId);
            if (selectedCategory?.children) {
                const sortedChildren = [...selectedCategory.children].sort((a, b) => b.size - a.size);
                return {
                    treemapData: sortedChildren,
                    selectedCategoryName: selectedCategory.name
                };
            }
        }

        // Otherwise show all categories (without children for main view)
        return {
            treemapData: allCategories.map(cat => ({
                ...cat,
                children: undefined // Remove children in main view to avoid nesting
            })),
            selectedCategoryName: null
        };
    }, [analyseCategoriesData, selectedCategoryId]);

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
        return <NoDataComponent />;
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

export default AnalyseCategoriesTreeMap;

import React, { JSX } from "react";
import { AnalyseCategoriesListeProps } from "../../Components.props.ts";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AnalyseTreeMapContent from "./AnalyseTreeMapContent.component.tsx";
import AnalyseTreeMapTooltip from "./AnalyseTreeMapTooltip.component.tsx";
import { useAnalyseTreeMapData } from "./AnalyseTreeMap.controller.ts";
import { NoDataComponent } from "../../shared/NoDataComponent.tsx";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";
import AnalyseCategoriesModel from "../../../Models/analyses/syntheses/AnalyseCategories.model.ts";


interface TreemapContentRendererProps {
    selectedCategory: CategorieOperationModel | undefined;
    analyseCategoriesData: AnalyseCategoriesModel[];
    onCategoryClick: (selectedCategory: CategorieOperationModel | undefined) => void;
    [key: string]: any; // Props transmises par Treemap (categoryId, x, y, width, height, ...)
}

/**
 * Rendu du contenu d'une cellule de la Treemap.
 * Composant top-level (hors du composant parent) pour éviter la recréation à chaque render.
 */
const TreemapContentRenderer: React.FC<TreemapContentRendererProps> = ({ selectedCategory, analyseCategoriesData, onCategoryClick, ...props }) => (
    <AnalyseTreeMapContent
        {...props}
        onClick={!selectedCategory && props.categoryId
            ? () => onCategoryClick(analyseCategoriesData.find(cat => cat.categorie.id === props.categoryId)?.categorie)
            : undefined}
    />
);


const AnalyseTreeMap: React.FC<AnalyseCategoriesListeProps> = ({ analyseCategories: analyseCategoriesData, selectedCategories, setFilters }): JSX.Element => {

    /**
     * Transform analyse categories data into treemap format
     */
    const { treemapData, selectedCategory } = useAnalyseTreeMapData(
        analyseCategoriesData,
        selectedCategories
    );

    /**
     * Handle click on a category to drill down
     */
    const handleCategoryClick = (selectedCategory: CategorieOperationModel | undefined) => {
        if (selectedCategory) {
            setFilters?.(prev => ({
                ...prev,
                selectedCategories: [selectedCategory]
            }));
        }
    };

    /**
     * Reset to show all categories
     */
    const handleBackToAll = () => {
        setFilters?.(prev => ({
            ...prev,
            selectedCategories: []
        }));
    };

    if (!treemapData || treemapData.length === 0) {
        return (<NoDataComponent />);
    }

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
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
                        color: selectedCategory ? 'primary.main' : 'text.primary',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}>
                    <HomeIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                </Link>
                {selectedCategory && (
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        {selectedCategory.libelle}
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
                            <TreemapContentRenderer
                                {...props}
                                selectedCategory={selectedCategory}
                                analyseCategoriesData={analyseCategoriesData}
                                onCategoryClick={handleCategoryClick}
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

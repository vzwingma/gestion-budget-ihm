import AnalyseCategoriesModel from "../../../Models/analyses/details/AnalyseCategories.model.ts";
import { generateDerivedColors } from "../../../Utils/renderers/DerivedColors.renderer.utils.ts";

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


export function useAnalyseTreeMapData(analyseCategoriesData: AnalyseCategoriesModel[], selectedCategoryId: string | null) {
        if (!analyseCategoriesData || analyseCategoriesData.length === 0) {
            return { treemapData: [], selectedCategoryName: null };
        }

        const allCategories = analyseCategoriesData
            .filter(cat => cat.pourcentage > 0)
            .map(categoryData => {
                const derivedColors = generateDerivedColors(categoryData.couleurCategorie, Object.values(categoryData.resumesSsCategories || {}).length);

                const children: TreemapNode[] = Object.values(categoryData.resumesSsCategories || {})
                    .filter(sscat => sscat.pourcentage > 0)
                    .map((ssCategoryData, index) => ({
                        name: ssCategoryData.ssCategorie.libelle,
                        size: ssCategoryData.pourcentage,
                        color: derivedColors[index], // Generate derived colors from parent category
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
    }
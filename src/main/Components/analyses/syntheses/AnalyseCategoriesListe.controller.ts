
import AnalyseCategoriesModel from '../../../Models/analyses/syntheses/AnalyseCategories.model.ts';
import AnalyseSsCategoriesModel from '../../../Models/analyses/syntheses/AnalyseSsCategories.model.ts';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';
import { getCategorieColor } from '../../../Utils/renderers/CategorieItem.renderer.tsx';


/**
 * Fonction pour obtenir la couleur du type de catégorie
 */
export const getCategoryTypeColor = (typeEnum: TYPES_CATEGORIES_OPERATION_ENUM | null | undefined): string => {
    if (!typeEnum) return '#999999';
    return `var(--color-type-${typeEnum.toLowerCase()}-primary)`; // Couleur générique pour tous les types (à personnaliser si besoin)
};

/**
 * Fonction pour obtenir les sous-catégories triées
 */
export const getSortedSubCategories = (category: AnalyseCategoriesModel): AnalyseSsCategoriesModel[] => {
    if (!category.resumesSsCategories) return [];
    return Object.values(category.resumesSsCategories).sort((a, b) =>
        a.ssCategorie.libelle.localeCompare(b.ssCategorie.libelle)
    );
};

/**
 * Largeurs des colonnes (synchronisées)
 */
export const COLUMN_WIDTHS = {
    expand: '3%',
    type: '5%',
    libelle: '34%',
    somme: '15%',
    operations: '12%',
    pourcentage: '31%'
};

    // Grouper les opérations par catégories et sous-catégories et calculer les totaux
export const getCategoriesDataForAnalyses = (operations: OperationModel[]) : AnalyseCategoriesModel[] => {
        if (!operations || operations.length === 0) return [];

        const categoriesMap: { [key: string]: AnalyseCategoriesModel } = {};

        // Grouper les opérations
        operations.forEach((operation) => {
            const categoryId = operation.categorie.id || 'UNKNOWN';
            const subCategoryId = operation.ssCategorie.id || 'UNKNOWN';

            // Créer ou récupérer la catégorie
            if (!categoriesMap[categoryId]) {
                const category = new AnalyseCategoriesModel();
                category.categorie = operation.categorie;
                category.couleurCategorie = getCategorieColor(category.categorie.id);
                categoriesMap[categoryId] = category;
            }

            const categoryModel = categoriesMap[categoryId];

            // Ajouter l'opération à la catégorie
            categoryModel.total = (categoryModel.total || 0) + operation.valeur;
            categoryModel.nbTransactions = (categoryModel.nbTransactions || 0) + 1;

            // Créer ou récupérer la sous-catégorie
            if (!categoryModel.resumesSsCategories[subCategoryId]) {
                const subCategory = new AnalyseSsCategoriesModel();
                subCategory.ssCategorie = { ...operation.ssCategorie, id: subCategoryId };
                subCategory.couleurSsCategorie = getCategorieColor(subCategory.ssCategorie.id);
                categoryModel.resumesSsCategories[subCategoryId] = subCategory;
            }

            const subCategoryModel = categoryModel.resumesSsCategories[subCategoryId];
            subCategoryModel.total = (subCategoryModel.total || 0) + operation.valeur;
            subCategoryModel.nbTransactions = (subCategoryModel.nbTransactions || 0) + 1;
        });

        // Calculer les pourcentages
        const totalGeneral = Object.values(categoriesMap).reduce(
            (sum, cat) => sum + Math.abs(cat.total || 0),
            0
        );

        Object.values(categoriesMap).forEach((category) => {
            const categoryTotal = Math.abs(category.total || 0);
            category.pourcentage = totalGeneral > 0 ? (categoryTotal / totalGeneral) * 100 : 0;

            Object.values(category.resumesSsCategories).forEach((subCategory) => {
                const subCategoryTotal = Math.abs(subCategory.total || 0);
                subCategory.pourcentage =
                    categoryTotal > 0 ? (subCategoryTotal / totalGeneral) * 100 : 0;
            });
        });

        // Trier par libellé alphabétiquement
        return Object.values(categoriesMap).sort((a, b) =>
            a.categorie.libelle.localeCompare(b.categorie.libelle)
        );
    };


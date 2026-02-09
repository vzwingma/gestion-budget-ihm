import React, { JSX, useState, useMemo } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { AnalyseCategoriesListeProps } from '../../Components.props.ts';
import AnalyseCategoriesModel from '../../../Models/analyses/categories/AnalyseCategories.model.ts';
import { getHeightDetailList } from '../../../Utils/ListData.utils.tsx';

/**
 * Composant pour afficher une barchart simple
 */
const PercentageBar: React.FC<{ percentage: number }> = ({ percentage }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
        <Box
            sx={{
                width: '100%',
                height: 20,
                backgroundColor: 'var(--color-border)',
                borderRadius: 1,
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: 'var(--color-primary)',
                    transition: 'width 0.3s ease'
                }}
            />
        </Box>
        <Typography variant="caption" sx={{ minWidth: 40 }}>
            {percentage.toFixed(1)}%
        </Typography>
    </Box>
);


/**
 * Fonction pour obtenir la couleur du type de catégorie
 */
const getCategoryTypeColor = (typeEnum: string | null | undefined): string => {
    if (!typeEnum) return '#999999';
    switch (typeEnum) {
        case 'REVENUS':
            return '#4CAF50';
        case 'ESSENTIEL':
            return '#2196F3';
        case 'PLAISIR':
            return '#FF9800';
        case 'ECONOMIES':
            return '#9C27B0';
        default:
            return '#757575';
    }
};

/**
 * Fonction pour obtenir les sous-catégories triées
 */
const getSortedSubCategories = (category: AnalyseCategoriesModel): AnalyseCategoriesModel[] => {
    if (!category.resumesSsCategories) return [];
    return Object.values(category.resumesSsCategories).sort((a, b) =>
        a.categorie.libelle.localeCompare(b.categorie.libelle)
    );
};

/**
 * Largeurs des colonnes (synchronisées)
 */
const COLUMN_WIDTHS = {
    expand: '3%',
    type: '5%',
    libelle: '34%',
    somme: '15%',
    operations: '12%',
    pourcentage: '31%'
};

/**
 * Composant de treelist des catégories et sous-catégories d'opérations
 * @param operations liste des opérations à afficher
 * @returns {JSX.Element} treelist
 */
const AnalyseCategoriesListe: React.FC<AnalyseCategoriesListeProps> = ({
    operations
}): JSX.Element => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const handleToggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    // Grouper les opérations par catégories et sous-catégories et calculer les totaux
    const categoriesData = useMemo(() => {
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
                categoriesMap[categoryId] = category;
            }

            const categoryModel = categoriesMap[categoryId];

            // Ajouter l'opération à la catégorie
            categoryModel.listeOperations.push(operation);
            categoryModel.total['MONTANT'] = (categoryModel.total['MONTANT'] || 0) + operation.valeur;
            categoryModel.nbTransactions['MONTANT'] = (categoryModel.nbTransactions['MONTANT'] || 0) + 1;

            // Créer ou récupérer la sous-catégorie
            if (!categoryModel.resumesSsCategories[subCategoryId]) {
                const subCategory = new AnalyseCategoriesModel();
                subCategory.categorie = { ...operation.ssCategorie, id: subCategoryId };
                categoryModel.resumesSsCategories[subCategoryId] = subCategory;
            }

            const subCategoryModel = categoryModel.resumesSsCategories[subCategoryId];
            subCategoryModel.listeOperations.push(operation);
            subCategoryModel.total['MONTANT'] = (subCategoryModel.total['MONTANT'] || 0) + operation.valeur;
            subCategoryModel.nbTransactions['MONTANT'] = (subCategoryModel.nbTransactions['MONTANT'] || 0) + 1;
        });

        // Calculer les pourcentages
        const totalGeneral = Object.values(categoriesMap).reduce(
            (sum, cat) => sum + (cat.total['MONTANT'] || 0),
            0
        );

        Object.values(categoriesMap).forEach((category) => {
            const categoryTotal = category.total['MONTANT'] || 0;
            category.pourcentage['MONTANT'] = totalGeneral > 0 ? (categoryTotal / totalGeneral) * 100 : 0;

            Object.values(category.resumesSsCategories).forEach((subCategory) => {
                const subCategoryTotal = subCategory.total['MONTANT'] || 0;
                subCategory.pourcentage['MONTANT'] =
                    categoryTotal > 0 ? (subCategoryTotal / categoryTotal) * 100 : 0;
            });
        });

        // Trier par libellé alphabétiquement
        return Object.values(categoriesMap).sort((a, b) =>
            a.categorie.libelle.localeCompare(b.categorie.libelle)
        );
    }, [operations]);

    return (
        <Paper sx={{ marginTop: 2 }}>
            <Box sx={{ height: getHeightDetailList(useMediaQuery(useTheme().breakpoints.down('lg'))), display: 'flex', flexDirection: 'column' }}>
                {/* En-tête fixe */}
                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableHead sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
                            <TableRow sx={{ backgroundColor: 'var(--color-dark-bg)' }}>
                                <TableCell sx={{ width: COLUMN_WIDTHS.expand }} />
                                <TableCell sx={{ width: COLUMN_WIDTHS.type }}>Type</TableCell>
                                <TableCell sx={{ width: COLUMN_WIDTHS.libelle }}>Libellé</TableCell>
                                <TableCell align="right" sx={{ width: COLUMN_WIDTHS.somme }}>Somme</TableCell>
                                <TableCell align="right" sx={{ width: COLUMN_WIDTHS.operations }}>Opérations</TableCell>
                                <TableCell sx={{ width: COLUMN_WIDTHS.pourcentage }}>Pourcentage</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </Box>
                {/* Corps scrollable */}
                <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableBody>
                    {categoriesData.map((category) => {
                        const isExpanded = expandedCategories.has(category.categorie.id || '');
                        const subCategories = getSortedSubCategories(category);
                        const total = category.total['MONTANT'] || 0;
                        const nbTransactions = category.nbTransactions['MONTANT'] || 0;
                        const percentage = category.pourcentage['MONTANT'] || 0;

                        return (
                            <React.Fragment key={category.categorie.id}>
                                {/* Ligne catégorie */}
                                <TableRow
                                    sx={{
                                        backgroundColor: 'var(--color-background)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-light-hover)'
                                        },
                                        cursor: 'pointer'
                                    }}
                                >
                                    <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.expand }}>
                                        {subCategories.length > 0 && (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleToggleCategory(category.categorie.id || '')
                                                }
                                            >
                                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.type }}>
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                backgroundColor: getCategoryTypeColor(category.categorie.id),
                                                display: 'inline-block'
                                            }}
                                            title={category.categorie.id}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ paddingY: 1, fontWeight: 600, width: COLUMN_WIDTHS.libelle }}>
                                        {category.categorie.libelle}
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingY: 1, fontWeight: 600, width: COLUMN_WIDTHS.somme }}>
                                        {total.toFixed(2)} €
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingY: 1, width: COLUMN_WIDTHS.operations }}>
                                        {nbTransactions}
                                    </TableCell>
                                    <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.pourcentage }}>
                                        <PercentageBar percentage={percentage} />
                                    </TableCell>
                                </TableRow>

                                {/* Lignes sous-catégories */}
                                {isExpanded &&
                                    subCategories.map((subCategory) => {
                                        const subTotal = subCategory.total['MONTANT'] || 0;
                                        const subNbTransactions = subCategory.nbTransactions['MONTANT'] || 0;
                                        const subPercentage = subCategory.pourcentage['MONTANT'] || 0;

                                        return (
                                            <TableRow
                                                key={`${category.categorie.id}-${subCategory.categorie.id}`}
                                                sx={{ backgroundColor: 'var(--color-light-background)',
                                                        '&:hover': { backgroundColor: 'var(--color-very-light-hover)' }
                                                }}>
                                                <TableCell sx={{ paddingLeft: 4, paddingY: 1, width: COLUMN_WIDTHS.expand }} />
                                                <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.type }} />
                                                <TableCell sx={{ paddingY: 1, paddingLeft: 4, width: COLUMN_WIDTHS.libelle }}>
                                                    <Typography variant="body2">
                                                        {subCategory.categorie.libelle}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" sx={{ paddingY: 1, width: COLUMN_WIDTHS.somme }}>
                                                    {subTotal.toFixed(2)} €
                                                </TableCell>
                                                <TableCell align="right" sx={{ paddingY: 1, width: COLUMN_WIDTHS.operations }}>
                                                    {subNbTransactions}
                                                </TableCell>
                                                <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.pourcentage }}>
                                                    <PercentageBar percentage={subPercentage} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
                    </Table>
                </Box>
            </Box>
        </Paper>
    );
};

export default AnalyseCategoriesListe;

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
import { getHeightDetailList } from '../../../Utils/ListData.utils.tsx';
import { COLUMN_WIDTHS, getCategoriesDataForAnalyses as getAnalyseCategoriesData, getCategoryTypeColor, getSortedSubCategories } from './AnalyseCategoriesListe.controller.ts';

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
    const categoriesData = useMemo(() => getAnalyseCategoriesData(operations), [operations]);

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
                        const analyseSubCategories = getSortedSubCategories(category);
                        const total = category.total || 0;
                        const nbTransactions = category.nbTransactions || 0;
                        const percentage = category.pourcentage || 0;

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
                                    }}>
                                    <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.expand }}>
                                        {analyseSubCategories.length > 0 && (
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
                                    <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.type }}/>
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
                                    analyseSubCategories.map((analyseSubCat) => {
                                        const subTotal = analyseSubCat.total || 0;
                                        const subNbTransactions = analyseSubCat.nbTransactions || 0;
                                        const subPercentage = analyseSubCat.pourcentage || 0;

                                        return (
                                            <TableRow
                                                key={`${category.categorie.id}-${analyseSubCat.ssCategorie.id}`}
                                                sx={{ backgroundColor: 'var(--color-light-background)',
                                                        '&:hover': { backgroundColor: 'var(--color-very-light-hover)' }
                                                }}>
                                                <TableCell sx={{ paddingLeft: 4, paddingY: 1, width: COLUMN_WIDTHS.expand }} />
                                                <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.type }} >
                                                    <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                backgroundColor: getCategoryTypeColor(analyseSubCat.ssCategorie.type),
                                                display: 'inline-block'
                                            }}
                                            title={analyseSubCat.ssCategorie.type}
                                        />
                                                    </TableCell>
                                                <TableCell sx={{ paddingY: 1, paddingLeft: 4, width: COLUMN_WIDTHS.libelle }}>
                                                    <Typography variant="body2">
                                                        {analyseSubCat.ssCategorie.libelle}
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

import React, { JSX, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { ExpandMore, ExpandLess, KeyboardDoubleArrowUp, KeyboardDoubleArrowDown } from '@mui/icons-material';
import { getHeightDetailList } from '../../../Utils/renderers/ListData.renderer.utils.tsx';
import { COLUMN_WIDTHS, getCategoryTypeColor, getSortedSubCategories } from './AnalyseCategoriesListe.controller.ts';
import OperationValue from '../../../Utils/renderers/OperationValue.renderer.tsx';
import { getCategorieColor, getCategorieIcon } from '../../../Utils/renderers/CategorieItem.renderer.tsx';
import { CenterComponent } from '../../shared/CenterComponent.tsx';
import { AnalyseCategoriesListeProps } from '../../Components.props.ts';
import { generateDerivedColors } from '../../../Utils/renderers/DerivedColors.renderer.utils.ts';
import { NoDataComponent } from '../../shared/NoDataComponent.tsx';

/**
 * Composant pour afficher une barchart simple
 */
const PercentageBar: React.FC<{ percentage: number, color?: string, subcategory?: boolean }> = ({ percentage, color, subcategory }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
        <Box
            sx={{
                width: '100%',
                height: subcategory ? 5 : 20,
                backgroundColor: 'var(--color-border)',
                borderRadius: 1,
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: color,
                    borderRadius: 1,
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
    analyseCategories : analyseCategoriesData
}): JSX.Element => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));


    const handleToggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };


    if (!analyseCategoriesData || analyseCategoriesData.length === 0) {
        return <NoDataComponent />;
    }

    return (<Box sx={{ height: getHeightDetailList(isMobile), display: 'flex', flexDirection: 'column' }}>
                {/* En-tête fixe */}
                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableHead sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
                            <TableRow sx={{ backgroundColor: 'var(--color-dark-container)' }}>
                                <TableCell sx={{ width: COLUMN_WIDTHS.expand }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (expandedCategories.size === analyseCategoriesData.length) {
                                                setExpandedCategories(new Set());
                                            } else {
                                                setExpandedCategories(new Set(analyseCategoriesData.map(cat => cat.categorie.id || '')));
                                            }
                                        }}
                                        title={expandedCategories.size === analyseCategoriesData.length ? 'Collapse all' : 'Expand all'}
                                    >
                                        {expandedCategories.size === analyseCategoriesData.length ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
                                    </IconButton>
                                </TableCell>
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
                            {analyseCategoriesData.map((analyseCat) => {
                                const isExpanded = expandedCategories.has(analyseCat.categorie.id || '');
                                const analyseSubCategories = getSortedSubCategories(analyseCat);
                                const derivedColors = generateDerivedColors(analyseCat.couleurCategorie, analyseSubCategories.length);
                                const total = analyseCat.total || 0;
                                const nbTransactions = analyseCat.nbTransactions || 0;
                                const percentage = analyseCat.pourcentage || 0;

                                return (
                                    <React.Fragment key={analyseCat.categorie.id}>
                                        {/* Ligne catégorie */}
                                        <TableRow
                                            sx={{
                                                backgroundColor: 'var(--color-dark-container)',
                                                '&:hover': {
                                                    backgroundColor: 'var(--color-analyses-hover)'
                                                }
                                            }}>
                                            <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.expand }}>
                                                {analyseSubCategories.length > 0 && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleToggleCategory(analyseCat.categorie.id || '')}>
                                                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.type }}>
                                                <Box width={isMobile ? 24 : 38} height={isMobile ? 24 : 38}
                                                    sx={{
                                                        borderRadius: '50%',
                                                        backgroundColor: getCategorieColor(analyseCat.categorie.id),
                                                        border: (isMobile ? '1px' : '2px') + ' solid #252525',
                                                        padding: isMobile ? '3px' : '6px',
                                                        color: '#252525'
                                                    }}>
                                                    <CenterComponent>{getCategorieIcon(analyseCat.categorie)}</CenterComponent>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ paddingY: 1, fontWeight: 600, width: COLUMN_WIDTHS.libelle }}>
                                                {analyseCat.categorie.libelle}
                                            </TableCell>
                                            <TableCell align="right" sx={{ paddingY: 1, fontWeight: 600, width: COLUMN_WIDTHS.somme }}>
                                                <OperationValue id={"value_" + analyseCat.categorie.id} valueOperation={total} showSign={true} />
                                            </TableCell>
                                            <TableCell align="right" sx={{ paddingY: 1, width: COLUMN_WIDTHS.operations }}>
                                                {nbTransactions}
                                            </TableCell>
                                            <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.pourcentage }}>
                                                <PercentageBar percentage={percentage} color={getCategorieColor(analyseCat.categorie.id)}/>
                                            </TableCell>
                                        </TableRow>


                                        {/* Lignes sous-catégories */}
                                        {
                                        isExpanded &&
                                            analyseSubCategories.map((analyseSubCat, index) => {
                                                const subTotal = analyseSubCat.total || 0;
                                                const subNbTransactions = analyseSubCat.nbTransactions || 0;
                                                const subPercentage = analyseSubCat.pourcentage || 0;

                                                return (
                                                    <TableRow
                                                        key={`${analyseCat.categorie.id}-${analyseSubCat.ssCategorie.id}`}
                                                        sx={{
                                                            backgroundColor: 'var(--color-dark-bg)',
                                                            '&:hover': { backgroundColor: 'var(--color-analyses-hover)' }
                                                        }}>
                                                        <TableCell sx={{ paddingLeft: 4, paddingY: 1, width: COLUMN_WIDTHS.expand }} />
                                                        <TableCell sx={{ paddingLeft: 3, paddingY: 1, width: COLUMN_WIDTHS.type, justifyContent: 'center', alignItems: 'center'}} >
                                                            <CenterComponent>
                                                                <Box sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: getCategoryTypeColor(analyseSubCat.ssCategorie.type)
                                                                }}  title={analyseSubCat.ssCategorie.type} />
                                                                </CenterComponent>
                                                        </TableCell>
                                                        <TableCell sx={{ paddingY: 1, paddingLeft: 4, width: COLUMN_WIDTHS.libelle }}>
                                                            <Typography variant="caption">
                                                                {analyseSubCat.ssCategorie.libelle}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ paddingY: 1, width: COLUMN_WIDTHS.somme }}>
                                                            <Typography variant="caption">
                                                                <OperationValue id={"value_" + analyseSubCat.ssCategorie.id} valueOperation={subTotal} showSign={true} />
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ paddingY: 1, width: COLUMN_WIDTHS.operations }}>
                                                            <Typography variant="caption">{subNbTransactions}</Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ paddingY: 1, width: COLUMN_WIDTHS.pourcentage }}>
                                                            <PercentageBar percentage={subPercentage} color={derivedColors[index]} subcategory={true} />
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
    );
};

export default AnalyseCategoriesListe;

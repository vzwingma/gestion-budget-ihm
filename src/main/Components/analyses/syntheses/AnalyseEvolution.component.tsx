import React, { JSX, useMemo } from 'react'
import { AnalyseEvolutionProps } from '../../Components.props.ts';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { prepareGraphDataFromOperations, extractUniqueCategories } from './AnalyseEvolution.controller.ts';
import { getCategorieColor } from '../../../Utils/renderers/CategorieItem.renderer.tsx';
import AnalyseEvolutionTooltip from './AnalyseEvolutionTooltip.component.tsx';
import { NoDataComponent } from '../../shared/NoDataComponent.tsx';
import HomeIcon from '@mui/icons-material/Home';

/**
 * Composant d'analyse de l'évolution des catégories par mois
 * @param budgetConsolide budget consolidé pour l'analyse
 * @param operations liste des opérations à analyser
 * @param isVueMensuelle indique si la vue est mensuelle ou annuelle (affecte la préparation des données du graphique)
 * @returns {JSX.Element} tuile avec graphique d'évolution
 * @constructor constructeur
 *
 */
const AnalyseEvolution: React.FC<AnalyseEvolutionProps> = ({ budgetConsolide, operations, isVueMensuelle }): JSX.Element => {

    /**
     * Prépare les données du graphique à partir des opérations
     */
    const graphData = useMemo(() => prepareGraphDataFromOperations(budgetConsolide, operations, isVueMensuelle), [budgetConsolide, operations, isVueMensuelle]);

    /**
     * Extrait les catégories uniques avec leurs couleurs
     */
    const categories = useMemo(() => {
        const cats = extractUniqueCategories(operations);

        return cats.map(cat => ({
            ...cat,
            couleur: getCategorieColor(cat.id)
        }));
    }, [operations]);

    /**
     * Rend les lignes du graphique pour chaque catégorie
     */
    const renderEvolutionsCategories = (): JSX.Element[] => {
        return categories
            .map(categorie => (
                <Line
                    key={categorie.libelle}
                    type="monotone"
                    dataKey={categorie.libelle}
                    stroke={categorie.couleur}
                    strokeWidth={1}
                    dot={false}
                    isAnimationActive={true}
                />
            ));
    };

    /**
     * Rend la ligne du graphique pour l'évolution du solde
     */
    const renderEvolutionsSoldes = (): JSX.Element => {
        return <Line
            name="Solde"
            type="monotone"
            dataKey="solde"
            stroke={"red"}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
        />
    };


    // Afficher un message si pas de données
    if (!operations || operations.length === 0 || Object.values(budgetConsolide.soldesParMois).length === 0) {
        return <NoDataComponent />;
    }

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'auto'
        }}>
            {/* Breadcrumb navigation */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, px: 1 }}>
                <Link
                    component="button"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}>
                    <HomeIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                </Link>
                {(
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        SOLDES
                    </Typography>
                )}
            </Breadcrumbs>

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={graphData}>
                    <CartesianGrid strokeDasharray="1 10" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis />
                    <Tooltip content={<AnalyseEvolutionTooltip />} />
                    {renderEvolutionsCategories()}
                    {renderEvolutionsSoldes()}
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AnalyseEvolution

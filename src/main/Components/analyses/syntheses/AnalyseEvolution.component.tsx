import React, { JSX, useMemo } from 'react'
import { AnalyseOperationsListeProps } from '../../Components.props.ts';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { getHeightDetailList } from '../../../Utils/renderers/ListData.renderer.utils.tsx';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { prepareGraphDataFromOperations, extractUniqueCategories } from './AnalyseEvolution.controller.ts';
import { getCategorieColor } from '../../../Utils/renderers/CategorieItem.renderer.tsx';
import AnalyseEvolutionTooltip from './AnalyseEvolutionTooltip.component.tsx';


/**
 * Composant d'analyse de l'évolution des catégories par mois
 * @param operations liste des opérations à analyser
 * @returns {JSX.Element} tuile avec graphique d'évolution
 * @constructor constructeur
 *
 */
const AnalyseEvolution: React.FC<AnalyseOperationsListeProps> = ({ operations }): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    /**
     * Prépare les données du graphique à partir des opérations
     */
    const graphData = useMemo(() => prepareGraphDataFromOperations(operations), [operations]);

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
    const renderLines = (): JSX.Element[] => {
        return categories.map(categorie => (
            <Line
                key={categorie.libelle}
                type="monotone"
                dataKey={categorie.libelle}
                stroke={categorie.couleur}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
            />
        ));
    };

    // Afficher un message si pas de données
    if (!operations || operations.length === 0) {
        return (
            <Box sx={{
                height: getHeightDetailList(isMobile),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
            }}>
                Aucune opération à afficher
            </Box>
        );
    }

    // Afficher un message si pas de données après regroupement
    if (graphData.length === 0) {
        return (
            <Box sx={{
                height: getHeightDetailList(isMobile),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
            }}>
                Pas de données disponibles pour le graphique
            </Box>
        );
    }

    return (
        <Box sx={{ 
            height: getHeightDetailList(isMobile),
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'auto' 
        }}>
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
                    {renderLines()}
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AnalyseEvolution

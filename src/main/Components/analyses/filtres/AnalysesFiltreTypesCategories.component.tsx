import React, { JSX } from 'react';
import { Box, Typography } from '@mui/material';
import { getTypeCategorieRenderer } from '../../../Utils/renderers/OperationItem.renderer.tsx';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';
import { AnalysesFiltreTypesCategoriesProps } from '../../Components.props.ts';



/**
 * Composant pour sélectionner les types de catégories d'opération
 * Affiche tous les types de catégories plus un "super type" TOUS
 * Les éléments sélectionnés sont appliqués en CSS (bordure 3px, texte blanc)
 * 
 * @component
 * @property {(selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[]) => void} onChange - Fonction appelée lors d'une sélection
 * @returns {JSX.Element} Élément JSX représentant le composant
 */
export const AnalysesFiltreTypesCategories: React.FC<AnalysesFiltreTypesCategoriesProps> = ({
    selectedTypes,
    onChange 
}: AnalysesFiltreTypesCategoriesProps): JSX.Element => {
    // Liste de tous les types disponibles
    const allTypes = Object.values(TYPES_CATEGORIES_OPERATION_ENUM);

    /**
     * Gère le clic sur un élément de type
     * @param {TYPES_CATEGORIES_OPERATION_ENUM | 'TOUS'} typeKey - Le type cliqué
     */
    const handleTypeClick = (typeKey: TYPES_CATEGORIES_OPERATION_ENUM | 'TOUS') => {
        let newSelectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[];

        if (typeKey === 'TOUS') {
            // Si TOUS est cliqué et que tous les types sont déjà sélectionnés, on désélectionne tout
            // Sinon on sélectionne tous les types
            if (selectedTypes.length === allTypes.length) {
                newSelectedTypes = [];
            } else {
                newSelectedTypes = [...allTypes];
            }
        } else if (selectedTypes.includes(typeKey)) {
            // Désélectionner le type
            newSelectedTypes = selectedTypes.filter(t => t !== typeKey);
        } else {
            // Sélectionner le type
            newSelectedTypes = [...selectedTypes, typeKey];

        }
        onChange(newSelectedTypes);
    };

    /**
     * Détermine si un type est sélectionné
     * @param {TYPES_CATEGORIES_OPERATION_ENUM | 'TOUS'} typeKey - Le type à vérifier
     * @returns {boolean} true si le type est sélectionné
     */
    const isTypeSelected = (typeKey: TYPES_CATEGORIES_OPERATION_ENUM | 'TOUS'): boolean => {
        if (typeKey === 'TOUS') {
            return selectedTypes.length === allTypes.length;
        }
        return selectedTypes.includes(typeKey);
    };

    /**
     * Rend un élément de type sélectionnable
     * @param {TYPES_CATEGORIES_OPERATION_ENUM | 'TOUS'} typeKey - Le type à rendre
     * @param {string} text - Le texte à afficher
     * @param {string} color - La couleur du type (ignorée pour TOUS)
     */
    const renderTypeElement = (
        typeKey: TYPES_CATEGORIES_OPERATION_ENUM | 'TOUS',
        text: string,
        color: string
    ): JSX.Element => {
        const isSelected = isTypeSelected(typeKey);
        const elementColor = typeKey === 'TOUS' ? 'var(--color-periode-default)' : color;

        return (
            <Typography
                key={typeKey}
                variant="overline"
                onClick={() => handleTypeClick(typeKey)}
                sx={{
                    border: `${isSelected ? '3px' : '1px'} solid ${elementColor}`,
                    padding: '8px',
                    paddingRight: '10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: isSelected ? 'white' : '#d0d0d0',
                    backgroundColor: isSelected ? elementColor : 'transparent',
                    display: 'inline-block',
                    marginRight: '8px',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.8,
                    },
                }}
            >
                {text}
            </Typography>
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center',
            }}
        >
            {/* Super type TOUS */}
            {renderTypeElement('TOUS', 'Tous', 'var(--color-periode-default)')}

            {/* Tous les types de catégories */}
            {allTypes.map((typeKey) => {
                const typeRenderer = getTypeCategorieRenderer(typeKey);
                return renderTypeElement(
                    typeKey,
                    typeRenderer.text,
                    typeRenderer.color
                );
            })}
        </Box>
    );
};

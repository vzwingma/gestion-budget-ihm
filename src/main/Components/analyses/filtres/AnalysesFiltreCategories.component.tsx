import React, { JSX } from "react";
import { Autocomplete, Box, TextField, useMediaQuery, useTheme } from "@mui/material";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";
import { AnalysesFiltresCategoriesProps } from "../../Components.props.ts";

/**
 * Composant pour filtrer les opérations par catégories.
 * Utilise un Autocomplete multiselect pour sélectionner plusieurs catégories.
 * 
 * @component
 * @property {CategorieOperationModel[]} distinctCategories - Liste de toutes les catégories disponibles
 * @property {CategorieOperationModel[]} selectedCategories - Liste des catégories sélectionnées
 * @property {(selectedCategories: CategorieOperationModel[]) => void} onChange - Callback lors d'une sélection
 * @returns {JSX.Element} Élément JSX représentant le composant
 */
export const AnalysesFiltreCategories: React.FC<AnalysesFiltresCategoriesProps> = ({
    distinctCategories,
    selectedCategories,
    onChange
}: AnalysesFiltresCategoriesProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    /**
     * Gère le changement de sélection des catégories
     * @param {any} event - L'événement de changement
     * @param {CategorieOperationModel[]} newValue - Les nouvelles catégories sélectionnées
     */
    const handleCategoriesChange = (event: any, newValue: CategorieOperationModel[]) => {
        onChange(newValue);
    };

    return (
        <Box sx={{ width: "100%", paddingX: 2 }}>
            <Autocomplete
                multiple
                id="filtres-categories"
                options={distinctCategories}
                value={selectedCategories}
                onChange={handleCategoriesChange}
                getOptionLabel={(option: CategorieOperationModel) => option?.libelle ?? ""}
                isOptionEqualToValue={(option: CategorieOperationModel, value: CategorieOperationModel) => 
                    option.id === value.id
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        placeholder={selectedCategories.length === 0 ? "Sélectionnez des catégories" : ""}
                    />
                )}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            sx={{ fontSize: isMobile ? 'small' : 'medium' }}
                            component="li"
                            {...optionProps}
                        >
                            {option.libelle}
                        </Box>
                    );
                }}
                sx={{
                    width: "100%",
                    '& .MuiAutocomplete-tag': {
                        fontSize: isMobile ? 'small' : 'medium',
                    }
                }}
            />
        </Box>
    );
};

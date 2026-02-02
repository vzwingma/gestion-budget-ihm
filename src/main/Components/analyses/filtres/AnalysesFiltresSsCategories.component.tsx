import React, { JSX } from "react";
import { Autocomplete, Box, TextField, useMediaQuery, useTheme } from "@mui/material";
import SsCategorieOperationModel from "../../../Models/budgets/SSCategorieOperation.model.ts";
import { AnalysesFiltresSsCategoriesProps } from "../../Components.props.ts";

/**
 * Composant pour filtrer les opérations par sous-catégories.
 * Utilise un Autocomplete multiselect pour sélectionner plusieurs sous-catégories.
 * 
 * @component
 * @property {SsCategorieOperationModel[]} distinctSubcategories - Liste de toutes les sous-catégories disponibles
 * @property {SsCategorieOperationModel[]} selectedSubcategories - Liste des sous-catégories sélectionnées
 * @property {(selectedSubcategories: SsCategorieOperationModel[]) => void} onChange - Callback lors d'une sélection
 * @returns {JSX.Element} Élément JSX représentant le composant
 */
export const AnalysesFiltresSsCategories: React.FC<AnalysesFiltresSsCategoriesProps> = ({
    distinctSubcategories,
    selectedSubcategories,
    onChange
}: AnalysesFiltresSsCategoriesProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    /**
     * Gère le changement de sélection des sous-catégories
     * @param {any} event - L'événement de changement
     * @param {SsCategorieOperationModel[]} newValue - Les nouvelles sous-catégories sélectionnées
     */
    const handleSubcategoriesChange = (event: any, newValue: SsCategorieOperationModel[]) => {
        onChange(newValue);
    };

    return (
        <Box sx={{ width: "100%", paddingX: 2 }}>
            <Autocomplete
                multiple
                id="filtres-ss-categories"
                options={distinctSubcategories}
                value={selectedSubcategories}
                onChange={handleSubcategoriesChange}
                groupBy={(option: SsCategorieOperationModel) => option?.categorieParente?.libelle ?? ""}
                getOptionLabel={(option: SsCategorieOperationModel) => option?.libelle ?? ""}
                isOptionEqualToValue={(option: SsCategorieOperationModel, value: SsCategorieOperationModel) => 
                    option.id === value.id
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        placeholder={selectedSubcategories.length === 0 ? "Sélectionnez des sous-catégories" : ""}
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

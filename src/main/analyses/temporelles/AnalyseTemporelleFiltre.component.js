import {Checkbox, FormControlLabel} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import {CheckCircle, RadioButtonUnchecked} from "@mui/icons-material";

/**
 * Composant pour l'affichage des filtres de l'analyse temporelle.
 * @param listeCategories - Les catégories à afficher.
 * @param onFilterChange - La fonction à appeler lorsqu'un filtre change.
 * @returns {unknown[]} Les filtres de l'analyse temporelle.
 * @constructor
 */
const AnalyseTemporelleFiltre = ({listeCategories, onFilterChange}) => {

    // Définition des types des propriétés
    AnalyseTemporelleFiltre.propTypes = {
        listeCategories: PropTypes.array.isRequired,
        onFilterChange: PropTypes.func.isRequired
    }

    return (
        listeCategories.map(categorie => {
                return (<FormControlLabel
                        id={categorie.id}
                        key={categorie.id}
                        control={<Checkbox id={categorie.id} defaultChecked icon={<RadioButtonUnchecked/>}
                                           checkedIcon={<CheckCircle/>}/>}
                        label={categorie.libelle}
                        style={{color: categorie.couleurCategorie}}
                        onChange={onFilterChange}/>
                )
            }
        )
    )

};

export default AnalyseTemporelleFiltre

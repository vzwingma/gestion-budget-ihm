import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { AnalyseTemporelleFiltreProps } from "../../Components.props";



/**
 * Composant pour l'affichage des filtres de l'analyse temporelle.
 * @param listeCategories - Les catégories à afficher.
 * @param onFilterChange - La fonction à appeler lorsqu'un filtre change.
 * @returns {unknown[]} Les filtres de l'analyse temporelle.
 * @constructor
 */
const AnalyseTemporelleFiltre: React.FC<AnalyseTemporelleFiltreProps> = ({ listeCategories, onFilterChange }: AnalyseTemporelleFiltreProps): JSX.Element[] => {

    return (
        listeCategories.map(categorie => {
            return (<FormControlLabel
                id={categorie.id}
                key={categorie.id}
                control={<Checkbox id={categorie.id}
                    defaultChecked icon={<RadioButtonUnchecked />}
                    checkedIcon={<CheckCircle />} />}
                label={categorie.libelleCategorie}
                style={{ color: categorie.couleur }}
                onChange={onFilterChange} />
            )
        }
        )
    )

};

export default AnalyseTemporelleFiltre

import {Stack, Typography} from "@mui/material";
import React, {JSX} from "react";
import AnneeRange from "./AnneeRange.component.js";
import {AnalyseTemporelleTitreProps} from "../../Components.props.js";


/**
 * Composant pour l'affichage du titre de l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.currentCompte - Le compte courant.
 * @param {number} props.currentAnnee - L'année courante.
 * @param {function} props.onAnneeChange - Fonction pour gérer le changement d'année.
 * @returns {JSX.Element} Le composant du titre de l'analyse temporelle.
 */
const AnalyseTemporelleTitre: React.FC<AnalyseTemporelleTitreProps> = ({currentCompte, currentAnnee, onAnneeChange} : AnalyseTemporelleTitreProps): JSX.Element => {

    return (
        // Création d'une pile pour l'affichage du titre
        <Stack direction={"row"} spacing={2} justifyContent="center" alignItems="center" alignContent={"center"}>
            <Stack direction={"row"} spacing={2}>
                <img src={"/img/banques/" + currentCompte.itemIcon} className={"compteIcon"}
                     alt={currentCompte.libelle}/>
                <Typography variant={"h6"} component="div" textAlign={"center"}
                            justifyContent={"center"} alignContent={"center"}>
                    {currentCompte.libelle}
                </Typography>
            </Stack>
            <Typography variant={"caption"} sx={{color: "#808080"}} component="div">
                    <AnneeRange onAnneeChange={onAnneeChange} selectedAnnee={currentAnnee}/>
                </Typography>
        </Stack>
    )
};

export default AnalyseTemporelleTitre

import {Stack, Typography} from "@mui/material";
import React, {JSX} from "react";
import AnneeRange from "./AnneeRange.component";
import {AnalyseTemporelleTitreProps} from "../../Components.props";


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
        <Stack direction={"row"} spacing={1} justifyContent="center" alignItems="center"
               marginTop={"3pt"}>

            <img src={"/img/banques/" + currentCompte.itemIcon} width={70} height={70} alt={currentCompte.libelle}/>
            <Stack direction={"column"}>
                <Typography variant={"h6"} component="div" width={250} textAlign={"center"}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={250}
                            textAlign={"center"}>
                    <AnneeRange onAnneeChange={onAnneeChange} selectedAnnee={currentAnnee}/>
                </Typography>
            </Stack>
        </Stack>
    )
};

export default AnalyseTemporelleTitre

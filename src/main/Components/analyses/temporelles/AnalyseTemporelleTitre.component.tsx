import {Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
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
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    return (
        // Création d'une pile pour l'affichage du titre
        <Stack direction={"row"} spacing={1} justifyContent="center" alignItems="center"
               marginTop={"3pt"}>

            <img src={"/img/banques/" + currentCompte.itemIcon} className={"compteIcon"} alt={currentCompte.libelle}/>
            <Stack direction={isMobile ? "row" : "column"}>
                <Typography variant={"h6"} component="div" width={isMobile ? 120 : 250} textAlign={"center"}
                            justifyContent={"center"} alignContent={"center"}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={isMobile ? 350 : 250}
                            textAlign={"center"}>
                    <AnneeRange onAnneeChange={onAnneeChange} selectedAnnee={currentAnnee}/>
                </Typography>
            </Stack>
        </Stack>
    )
};

export default AnalyseTemporelleTitre

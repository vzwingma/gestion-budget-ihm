import {Stack, Typography} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import AnneeRange from "./AnneeRange.component";

/**
 * Composant pour l'affichage du titre de l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.currentCompte - Le compte courant.
 * @param {number} props.currentAnnee - L'année courante.
 * @param {function} props.onAnneeChange - Fonction pour gérer le changement d'année.
 * @returns {JSX.Element} Le composant du titre de l'analyse temporelle.
 */
const AnalyseTemporelleTitre = ({currentCompte, currentAnnee, onAnneeChange}) => {

    // Définition des types des propriétés
    AnalyseTemporelleTitre.propTypes = {
        currentCompte: PropTypes.object.isRequired,
        currentAnnee: PropTypes.number.isRequired,
        onAnneeChange: PropTypes.func.isRequired
    }

    return (
        // Création d'une pile pour l'affichage du titre
        <Stack direction={"row"} spacing={1} paddingLeft={35} justifyContent="center" alignItems="center"
               marginTop={"3pt"}>

            <img src={"/img/banques/" + currentCompte.icon} width={70} height={70} alt={currentCompte.libelle}/>
            <Stack direction={"column"}>
                <Typography variant={"h6"} component="div" width={300} textAlign={"center"}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={300}
                            textAlign={"center"}>
                    <AnneeRange onAnneeChange={onAnneeChange} selectedAnnee={currentAnnee}/>
                </Typography>
            </Stack>
        </Stack>
    )
};

export default AnalyseTemporelleTitre

import {Divider, Stack, Typography} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import AnneeRange from "./AnneeRange.component";

/**
 * Page principale d'affichage du titre
 * @param currentCompte : compte courant
 * @param onAnneeChange : function changement de date
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const AnalyseTemporelleTitre = ({currentCompte, onAnneeChange}) => {

    AnalyseTemporelleTitre.propTypes = {
        currentCompte: PropTypes.object.isRequired,
        onAnneeChange: PropTypes.func.isRequired
    }

    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>

            <Divider orientation="vertical" flexItem/>
            <AnneeRange onAnneeChange={onAnneeChange} selectedAnnee={new Date(Date.now()).getFullYear()}/>
            <Divider orientation="vertical" flexItem/>
            <Stack direction={"row"} paddingLeft={45}>
                <img src={"/img/banques/" + currentCompte.icon} width={50} height={50} alt={currentCompte.libelle}/>
                <Stack direction={"column"}>
                    <Typography variant={"h6"} component="div" width={300} textAlign={"center"}>
                        {currentCompte.libelle}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
};

export default AnalyseTemporelleTitre

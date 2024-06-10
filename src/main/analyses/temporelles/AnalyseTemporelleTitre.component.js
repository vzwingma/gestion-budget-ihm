import {Stack, Typography} from "@mui/material";
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
const AnalyseTemporelleTitre = ({currentCompte, currentAnnee, onAnneeChange}) => {

    AnalyseTemporelleTitre.propTypes = {
        currentCompte: PropTypes.object.isRequired,
        currentAnnee: PropTypes.number.isRequired,
        onAnneeChange: PropTypes.func.isRequired
    }

    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>
            <Stack direction={"row"} paddingLeft={45}>
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
        </Stack>
    )
};

export default AnalyseTemporelleTitre

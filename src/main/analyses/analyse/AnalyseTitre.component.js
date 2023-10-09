import OperationValue from '../../Utils/renderers/OperationValue.renderer'
import {Divider, Stack, Tooltip, Typography} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

/**
 * Page principale d'affichage du solde
 * @param currentCompte compte courant
 * @param currentDate date courante
 * @param currentBudget budget courant
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const AnalyseTitre = ({currentCompte, currentDate, currentBudget}) => {

    AnalyseTitre.propTypes = {
        currentCompte: PropTypes.object.isRequired,
        currentDate: PropTypes.any.isRequired,
        currentBudget: PropTypes.object.isRequired
    }

    // définition de la date courante
    const dateCourante = new Date(Date.now());

    function getTooltipAuj() {
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    function getTooltipFin() {
        return "Fin " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear();
    }

    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>
            <img src={"/img/banques/" + currentCompte.icon} width={50} height={50} alt={currentCompte.libelle}/>
            <Stack direction={"column"}>
                <Typography variant={"h6"} component="div" width={300} textAlign={"center"}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={300}
                            textAlign={"center"}>
                    {currentDate.toLocaleString('default', {month: 'long'}) + " " + currentDate.getFullYear()}
                </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem/>
            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} width={120} textAlign={"center"} sx={{cursor: "help"}}>
                    <OperationValue valueOperation={currentBudget.soldes.soldeAtMaintenant} showSign={true}/>
                </Typography>
            </Tooltip>
            {
                (currentBudget.actif) ?
                    <Tooltip title={getTooltipFin()}>
                        <Typography variant={"caption"} width={100} textAlign={"center"} sx={{cursor: "help"}}>
                            (<OperationValue valueOperation={currentBudget.soldes.soldeAtFinMoisCourant}
                                             showSign={true}/> )
                        </Typography>
                    </Tooltip>
                    : <></>
            }

            <Divider orientation="vertical" flexItem/>
        </Stack>
    )
};

export default AnalyseTitre

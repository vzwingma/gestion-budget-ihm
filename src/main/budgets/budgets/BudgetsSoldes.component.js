import OperationValue from '../operations/renderers/OperationSpanValue.component'
import {Stack, Tooltip, Typography} from "@mui/material";
import React from "react";
/*
 * Page principale du solde
 */


const BudgetsSoldes = ({currentCompte, currentBudget}) => {

    // définition de la date courante
    const dateCourante = new Date(Date.now());

    function getTooltipAuj() {
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    function getTooltipFin() {
        return "Fin " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear(); // { dateCourante.getDate() } { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() } }
    }

    return (
        <Stack direction={"row"} spacing={1} justifyContent="space-evenly" alignItems="center">
            <img src={"/img/banques/" + currentCompte.icon} width={50} height={50} alt={currentCompte.libelle}/>
            <Typography variant={"h6"} component="div" align={"left"} sx={{spacing: 2}}>
                {currentCompte.libelle}
            </Typography>
            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} component="div" align={"left"} sx={{spacing: 2}}>
                    <OperationValue valueOperation={currentBudget.soldes.soldeAtMaintenant} showSign={true}/>
                </Typography>
            </Tooltip>
            <Tooltip title={getTooltipFin()}>
                <Typography variant={"h6"} component="div" align={"left"} sx={{spacing: 2}}>
                    <OperationValue valueOperation={currentBudget.soldes.soldeAtFinMoisCourant} showSign={true}/>
                </Typography>
            </Tooltip>
        </Stack>

    )
};

export default BudgetsSoldes

import OperationValue from '../operations/renderers/OperationSpanValue.component'
import {Divider, Stack, Tooltip, Typography} from "@mui/material";
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
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>
            <img src={"/img/banques/" + currentCompte.icon} width={50} height={50} alt={currentCompte.libelle}/>
            <Typography variant={"h6"} component="div" width={300} textAlign={"center"}>
                {currentCompte.libelle}
            </Typography>
            <Divider orientation="vertical" flexItem/>
            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} width={120} textAlign={"center"}>
                    <OperationValue valueOperation={currentBudget.soldes.soldeAtMaintenant} showSign={true}/>
                </Typography>
            </Tooltip>
            <Tooltip title={getTooltipFin()}>
                <Typography variant={"caption"} width={100} textAlign={"center"}>
                    (<OperationValue valueOperation={currentBudget.soldes.soldeAtFinMoisCourant} showSign={true}/> )
                </Typography>
            </Tooltip>
            <Divider orientation="vertical" flexItem/>
        </Stack>
    )
};

export default BudgetsSoldes

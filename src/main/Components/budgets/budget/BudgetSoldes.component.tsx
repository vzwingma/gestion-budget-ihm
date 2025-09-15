import OperationValue from '../../../Utils/renderers/OperationValue.renderer.js'
import {CircularProgress, Stack, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {JSX, useContext} from "react";
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.js';
import CenterComponent from '../../CenterComponent.js';

/**
 * Page principale d'affichage du solde
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const BudgetSoldes: React.FC = (): JSX.Element => {

    const {currentBudget} = useContext(BudgetContext)!;
    const budget = currentBudget!;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    // définition de la date courante
    const dateCourante = new Date(Date.now());

    function getTooltipAuj() {
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    function getTooltipFin() {
        return "Fin " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear();
    }


    return (
        <Stack direction={"column"} justifyContent="left" alignContent={"center"} alignItems="center">
            <Tooltip title={getTooltipAuj()}>
                {budget ?
                    <Typography variant={"h6"} width={isMobile ? 100 : 240} textAlign={"right"} sx={{cursor: "help"}}>
                        <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true}
                                        id={'soldeAtMaintenant'}/>
                    </Typography> :
                    <CenterComponent><CircularProgress/></CenterComponent>}
            </Tooltip>
            {(budget?.actif) ?
                <Tooltip title={getTooltipFin()}>
                    <Typography variant={"caption"} width={isMobile ? 100 : 240} textAlign={"right"}
                                sx={{cursor: "help"}}>
                        <span style={{color: "#808080"}}>(</span> <OperationValue
                        valueOperation={budget.soldes.soldeAtFinMoisCourant} showSign={true}
                        id={'soldeAtFinMoisCourant'}/> <span style={{color: "#808080"}}>)</span>
                    </Typography>
                </Tooltip>
                : <></>
            }
        </Stack>
    )
};

export default BudgetSoldes

import OperationValue from '../../../Utils/renderers/OperationValue.renderer'
import {Box, CircularProgress, Divider, Stack, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {JSX, useContext} from "react";
import {EventOutlined} from "@mui/icons-material";
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider';
import CenterComponent from '../../CenterComponent';

/**
 * Page principale d'affichage du solde
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const BudgetsTitre : React.FC = (): JSX.Element => {

    const {currentBudget, selectedCompte, selectedDate} = useContext(BudgetContext)!;
    const budget = currentBudget!;
    const currentCompte = selectedCompte!;
    const currentDate = selectedDate!;
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
        <Stack direction={"row"} spacing={1} justifyContent="left" alignContent={"center"} alignItems="center">
            <img src={"/img/banques/" + currentCompte.itemIcon} className={"compteIcon"} alt={currentCompte.libelle}/>
            <Stack direction={isMobile ? "row" : "column"} alignContent={"center"} alignItems="center">
                <Typography variant={"h6"} component="div" width={isMobile ? 150 : 300} textAlign={"center"}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={isMobile ? 100 : 300}
                            textAlign={isMobile ? "left" : "center"}>
                    {currentDate.toLocaleString('default', {month: 'long'}) + " " + currentDate.getFullYear()}
                </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem/>
            <Tooltip title={getTooltipAuj()}>
                {budget ?
                <Typography variant={"h6"} width={120} textAlign={"center"} sx={{cursor: "help"}}>
                    <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true} id={'soldeAtMaintenant'}/>
                </Typography> :
                <CenterComponent><CircularProgress /></CenterComponent> }
            </Tooltip>
            {(budget?.actif) ?
                <>
                    <Tooltip title={getTooltipFin()}>
                        <Box sx={{cursor: "help", height: "40px", width: "100px"}}>
                            <EventOutlined sx={{paddingTop: "8px", color: "#808080"}}/>
                            <Typography variant={"caption"} textAlign={"center"}>
                                <OperationValue valueOperation={budget.soldes.soldeAtFinMoisCourant}
                                showSign={true} id={'soldeAtFinMoisCourant'}/>
                            </Typography>
                        </Box>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem/></>
                    : <></>
            }
        </Stack>
    )
};

export default BudgetsTitre

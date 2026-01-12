import {Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {JSX, useContext} from "react";
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.tsx';

/**
 * Page principale d'affichage du solde
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const RecurrentsTitre: React.FC = (): JSX.Element => {

    const {selectedCompte, selectedDate} = useContext(BudgetContext);
    const currentCompte = selectedCompte;
    const currentDate = selectedDate;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <Stack direction={"row"} spacing={1} justifyContent="center" alignContent={"center"} alignItems="center">

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

        </Stack>
    )
};

export default RecurrentsTitre

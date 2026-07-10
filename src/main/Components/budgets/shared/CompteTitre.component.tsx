import {Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {JSX} from "react";
import { useBudgetContext } from "../../../Models/contextProvider/BudgetContextProvider.tsx";

/**
 * Composant réutilisable pour afficher le titre avec compte et date
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const CompteTitre: React.FC = (): JSX.Element => {

    const {selectedCompte, selectedDate} = useBudgetContext();
    const currentCompte = selectedCompte;
    const currentDate = selectedDate;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    if (!currentCompte) {
        return <></>;
    }

    return (
        <Stack direction={"row"} spacing={1} sx={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>

            <img src={"/img/banques/" + currentCompte.itemIcon} className={"compteIcon"} alt={currentCompte.libelle}/>
            <Stack direction={isMobile ? "row" : "column"} sx={{ alignContent: "center", alignItems: "center" }}>
                <Typography variant={"h6"} component="div" sx={{ textAlign: "center", width: isMobile ? 150 : 300 }}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} component="div"
                            sx={{ color: "#808080", width: isMobile ? 100 : 300, textAlign: isMobile ? "left" : "center" }}>
                    {currentDate.toLocaleString('default', {month: 'long'}) + " " + currentDate.getFullYear()}
                </Typography>
            </Stack>

        </Stack>
    )
};

export default CompteTitre

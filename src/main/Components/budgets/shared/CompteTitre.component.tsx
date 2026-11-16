import {Alert, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {JSX} from "react";
import { useBudgetSelection, useCurrentBudget } from "../../../hooks/useBudgetContext.ts";
import { getBanqueIconSrc } from "../../../Utils/Banque.utils.ts";
import { estBudgetDuMois, libelleMoisAnneeBudget } from "../../../Utils/Budget.utils.ts";

/**
 * Composant réutilisable pour afficher le titre avec compte et date
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const CompteTitre: React.FC = (): JSX.Element => {

    const {selectedCompte, selectedDate} = useBudgetSelection();
    const { currentBudget } = useCurrentBudget();
    const currentCompte = selectedCompte;
    const currentDate = selectedDate;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    if (!currentCompte) {
        return <></>;
    }

    // Compte inactif renvoyant le dernier budget disponible, d'un mois antérieur au mois demandé
    // (IHM AP011, décision 👤 C2) : le mois sélectionné reste affiché ci-dessous, avec ce bandeau.
    const afficherBandeauCompteInactif = !currentCompte.actif
        && currentBudget !== undefined
        && !estBudgetDuMois(currentBudget, currentDate);

    return (
        <Stack direction={"column"} spacing={1} sx={{ alignItems: "center" }}>
            <Stack direction={"row"} spacing={1} sx={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>

                <img src={getBanqueIconSrc(currentCompte.itemIcon)} className={"compteIcon"} alt={currentCompte.libelle}/>
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
            {afficherBandeauCompteInactif &&
                <Alert severity="warning" sx={{ width: isMobile ? 250 : 400 }}>
                    {"Compte inactif — dernier budget disponible : " + libelleMoisAnneeBudget(currentBudget)}
                </Alert>
            }
        </Stack>
    )
};

export default CompteTitre

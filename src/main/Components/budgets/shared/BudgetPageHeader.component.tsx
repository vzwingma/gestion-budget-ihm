import React, {JSX, ReactNode} from "react";
import {Grid} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import OperationFilter from "./OperationFilter.component.tsx";

import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import CompteTitre from "./CompteTitre.component.tsx";

interface BudgetPageHeaderProps {
    onOpenMenu: () => void;
    filterOperations: string | null;
    onFilterChange: (value: string) => void;
    selectedCompte: CompteBancaireModel | null;
    selectedDate: Date | null;
    filterPlaceholder?: string;
    additionalHeaderContentLeft?: ReactNode;
    additionalHeaderContentRight?: ReactNode;
}

/**
 * Composant d'en-tête partagé pour les pages de budget
 * @param {BudgetPageHeaderProps} props - Les propriétés du composant
 * @returns {JSX.Element} - Le composant JSX de l'en-tête
 */
const BudgetPageHeader: React.FC<BudgetPageHeaderProps> = ({
    onOpenMenu,
    filterOperations,
    onFilterChange,
    selectedCompte,
    selectedDate,
    filterPlaceholder = "Filtrage des opérations",
    additionalHeaderContentLeft,
    additionalHeaderContentRight
}: BudgetPageHeaderProps): JSX.Element => {

    return (
        <Grid container marginTop={1} sx={{overflow: "hidden"}}>
            <Grid size={{md: 0.6, xl: 0.4}} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <MenuIcon 
                    onClick={onOpenMenu}
                    className={"editableField"}
                    fontSize={"large"} 
                />
            </Grid>
            <Grid size={{md: 2.8, xl: 2}} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <OperationFilter
                    filterValue={filterOperations}
                    onFilterChange={onFilterChange}
                    placeholder={filterPlaceholder}
                />
            </Grid>
            {additionalHeaderContentLeft}
            <Grid size={{md: additionalHeaderContentLeft ? 6 : 7.6, xl: additionalHeaderContentLeft ? 7 : 8.6}} 
                  sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                {selectedDate != null && selectedCompte != null ?
                    <CompteTitre />
                    :
                    <></>
                }
            </Grid>
            {additionalHeaderContentRight}
        </Grid>
    );
};

export default BudgetPageHeader;

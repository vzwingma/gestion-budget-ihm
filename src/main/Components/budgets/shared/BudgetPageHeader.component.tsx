import React, {JSX, ReactNode} from "react";
import {Grid} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import OperationsFiltre from "./OperationsFiltre.component.tsx";

import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import CompteTitre from "./CompteTitre.component.tsx";

/** Colonnes (Grid 12) du menu et du champ de filtre : la barre de filtres reprend celles du champ pour s'aligner dessus */
export const HEADER_MENU_SIZE = {md: 0.6, xl: 0.4};
export const HEADER_FILTER_SIZE = {md: 2.8, xl: 2};

interface BudgetPageHeaderProps {
    onOpenMenu: () => void;
    filterOperations: string | null;
    onFilterChange: (value: string) => void;
    selectedCompte: CompteBancaireModel | null;
    selectedDate: Date | null;
    filterPlaceholder?: string;
    additionalHeaderContentLeft?: ReactNode;
    additionalHeaderContentRight?: ReactNode;
    /** Barre de filtres affichée sous le champ de filtrage : cellules Grid (sous le menu, puis colonnes du champ de filtre) */
    filterBar?: ReactNode;
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
    additionalHeaderContentRight,
    filterBar
}: BudgetPageHeaderProps): JSX.Element => {

    return (
        <Grid container sx={{overflow: "hidden", marginTop: 1}}>
            <Grid size={HEADER_MENU_SIZE} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <MenuIcon 
                    onClick={onOpenMenu}
                    className={"editableField"}
                    fontSize={"large"} 
                />
            </Grid>
            <Grid size={HEADER_FILTER_SIZE} sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <OperationsFiltre
                    filterValue={filterOperations}
                    onFilterChange={onFilterChange}
                    placeholder={filterPlaceholder}
                />
            </Grid>
            {additionalHeaderContentLeft}
            <Grid size={{md: additionalHeaderContentLeft ? 5.6 : 7.6, xl: additionalHeaderContentLeft ? 7 : 8.6}} 
                  sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                {selectedDate != null && selectedCompte != null ?
                    <CompteTitre />
                    :
                    <></>
                }
            </Grid>
            {additionalHeaderContentRight}
            {filterBar &&
                <>
                    <Grid size={HEADER_MENU_SIZE}/>
                    {filterBar}
                </>
            }
        </Grid>
    );
};

export default BudgetPageHeader;

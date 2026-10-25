import React, { JSX, ReactNode } from "react";
import { Backdrop, Box, CircularProgress, Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import BudgetPageHeader from "./BudgetPageHeader.component.tsx";
import { getHeightList } from "../../../Utils/renderers/ListData.renderer.utils.tsx";

interface BudgetPageShellProps {
    className: string;
    isLoading: boolean;
    onOpenMenu: () => void;
    filterOperations: string | null;
    onFilterChange: (value: string) => void;
    selectedCompte: CompteBancaireModel | null;
    selectedDate: Date;
    filterPlaceholder: string;
    additionalHeaderContentLeft?: ReactNode;
    additionalHeaderContentRight?: ReactNode;
    leftColumnSize: { md: number; xl: number };
    rightColumnSize: { md: number; xl: number };
    leftContent: ReactNode;
    rightContent: ReactNode;
}

/**
 * Structure de page partagée par `BudgetPage` et `RecurrentsPage` (AP 006 - T1) : Backdrop de
 * chargement, en-tête (`BudgetPageHeader`), Divider, et les 2 colonnes (liste / détail).
 *
 * Chaque page reste responsable de ses propres données (chargement, regroupement,
 * sélection d'opération) et ne fournit ici que le contenu des 2 colonnes.
 */
const BudgetPageShell: React.FC<BudgetPageShellProps> = ({
    className,
    isLoading,
    onOpenMenu,
    filterOperations,
    onFilterChange,
    selectedCompte,
    selectedDate,
    filterPlaceholder,
    additionalHeaderContentLeft,
    additionalHeaderContentRight,
    leftColumnSize,
    rightColumnSize,
    leftContent,
    rightContent
}: BudgetPageShellProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <Box className={className}>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <BudgetPageHeader
                onOpenMenu={onOpenMenu}
                filterOperations={filterOperations}
                onFilterChange={onFilterChange}
                selectedCompte={selectedCompte}
                selectedDate={selectedDate}
                filterPlaceholder={filterPlaceholder}
                additionalHeaderContentLeft={additionalHeaderContentLeft}
                additionalHeaderContentRight={additionalHeaderContentRight}
            />
            <Divider variant="middle" sx={{ marginTop: isMobile ? 0 : 1 }} />
            <Grid container sx={{ overflow: "hidden" }}>
                <Grid size={leftColumnSize} sx={{ overflow: "hidden", flexDirection: "column", maxHeight: 'true' }}>
                    {leftContent}
                </Grid>
                <Grid size={rightColumnSize} sx={{ overflow: "hidden", height: getHeightList(isMobile) }}>
                    {rightContent}
                </Grid>
            </Grid>
        </Box>
    );
};

export default BudgetPageShell;

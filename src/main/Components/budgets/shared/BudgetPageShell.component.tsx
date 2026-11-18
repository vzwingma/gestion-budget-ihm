import React, { JSX, ReactNode } from "react";
import { Alert, Backdrop, Box, Button, CircularProgress, Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import BudgetPageHeader from "./BudgetPageHeader.component.tsx";
import { FILTER_BAR_HEIGHT, getHeightList } from "../../../Utils/renderers/ListData.renderer.utils.tsx";

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
    /** Barre de filtres de l'en-tête (réserve `FILTER_BAR_HEIGHT` px sur la hauteur des colonnes) */
    filterBar?: ReactNode;
    leftColumnSize: { md: number; xl: number };
    rightColumnSize: { md: number; xl: number };
    leftContent: ReactNode;
    rightContent: ReactNode;
    /**
     * Échec du chargement du budget (IHM AP011 T2.1) : ferme le Backdrop et affiche `errorMessage`
     * avec un bouton « Réessayer » (`onRetry`) au lieu de bloquer l'écran indéfiniment.
     */
    errorMessage?: string;
    onRetry?: () => void;
}

/**
 * Structure de page partagée par `BudgetPage` et `RecurrentsPage` (AP 006 - T1) : Backdrop de
 * chargement, en-tête (`BudgetPageHeader`), Divider, et les 2 colonnes (liste / détail).
 *
 * Chaque page reste responsable de ses propres données (chargement, regroupement,
 * sélection d'opération) et ne fournit ici que le contenu des 2 colonnes.
 *
 * `errorMessage` (IHM AP011 T2.1) : ferme le Backdrop et affiche le message + bouton « Réessayer »
 * au lieu de bloquer l'écran indéfiniment (404/503 sur le chargement du budget).
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
    filterBar,
    leftColumnSize,
    rightColumnSize,
    leftContent,
    rightContent,
    errorMessage,
    onRetry
}: BudgetPageShellProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const isError = errorMessage !== undefined;

    return (
        <Box className={className}>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading && !isError}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {isError &&
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 4, gap: 2 }}>
                    <Alert severity="error">{errorMessage}</Alert>
                    <Button variant="outlined" color="error" onClick={onRetry}>Réessayer</Button>
                </Box>
            }

            <BudgetPageHeader
                onOpenMenu={onOpenMenu}
                filterOperations={filterOperations}
                onFilterChange={onFilterChange}
                selectedCompte={selectedCompte}
                selectedDate={selectedDate}
                filterPlaceholder={filterPlaceholder}
                additionalHeaderContentLeft={additionalHeaderContentLeft}
                additionalHeaderContentRight={additionalHeaderContentRight}
                filterBar={filterBar}
            />
            <Divider variant="middle" sx={{ marginTop: isMobile ? 0 : 1 }} />
            <Grid container sx={{ overflow: "hidden" }}>
                <Grid size={leftColumnSize} sx={{ overflow: "hidden", flexDirection: "column", maxHeight: 'true' }}>
                    {leftContent}
                </Grid>
                <Grid size={rightColumnSize} sx={{ overflow: "hidden", height: getHeightList(isMobile, filterBar ? FILTER_BAR_HEIGHT : 0) }}>
                    {rightContent}
                </Grid>
            </Grid>
        </Box>
    );
};

export default BudgetPageShell;

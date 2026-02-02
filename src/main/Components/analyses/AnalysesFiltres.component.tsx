import { Backdrop, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import React, { JSX, useCallback } from "react";
import { AnalysesFiltresProps } from "../Components.props.ts";
import { AnalysesFiltrePeriodeComponent } from "./filtres/AnalysesFiltrePeriode.component.tsx";


/**
 * Composant pour l'affichage du titre de l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.budgetConsolide - Le budget consolidé.
 * @param {Object} props.currentPeriode - La période courante.
 * @returns {JSX.Element} Le composant du titre de l'analyse temporelle.
 */
const AnalysesFiltres: React.FC<AnalysesFiltresProps> = ({ isLoading, budgetConsolide, currentPeriode, setPeriodeAnalyses }: AnalysesFiltresProps): JSX.Element => {

    const handlePeriodeChange = useCallback((periode) => {
        setPeriodeAnalyses(periode);
    }, [setPeriodeAnalyses]);

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Création d'une pile pour l'affichage du titre */}
            <Stack direction={"column"} spacing={2} justifyContent="center" alignItems="center" alignContent={"center"}>
                <Typography variant={"h3"} component="div" textAlign={"center"} justifyContent={"center"} alignContent={"center"}>
                    Filtres
                </Typography>
            <Typography variant={"h6"} component="div" textAlign={"center"} justifyContent={"center"} alignContent={"center"}>
                Filtres actifs
            </Typography>
            <Divider flexItem />
            <Typography variant={"body2"} component="div">
                <AnalysesFiltrePeriodeComponent periode={currentPeriode} onChange={handlePeriodeChange} />
            </Typography>
            <Divider flexItem />
            <Typography variant={"h6"} component="div" textAlign={"center"} justifyContent={"center"} alignContent={"center"}>
                Types
            </Typography>
            <Divider flexItem />
            <Typography variant={"h6"} component="div" textAlign={"center"} justifyContent={"center"} alignContent={"center"}>
                Opérations
            </Typography>
            <Divider flexItem />
            <Typography variant={"h6"} component="div" textAlign={"center"} justifyContent={"center"} alignContent={"center"}>
                catégories
            </Typography>
            <Divider flexItem />
            <Typography variant={"h6"} component="div" textAlign={"center"} justifyContent={"center"} alignContent={"center"}>
                Ss Categories
            </Typography>

        </Stack>
        </>
    )
};

export default AnalysesFiltres
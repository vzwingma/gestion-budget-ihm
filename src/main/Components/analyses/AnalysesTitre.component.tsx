import { Stack, Typography } from "@mui/material";
import React, { JSX } from "react";
import { AnalysesTitreProps } from "../Components.props.ts";
import { AnalysesPeriodeModel } from "../../Models/analyses/AnalysesPeriode.model.ts";
import { getLabelMonthFRFromDate } from "../../Utils/Date.utils.ts";


/**
 * Composant pour l'affichage du titre de l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.currentCompte - Le compte courant.
 * @param {Object} props.currentPeriode - La période courante.
 * @returns {JSX.Element} Le composant du titre de l'analyse temporelle.
 */
const AnalysesTitre: React.FC<AnalysesTitreProps> = ({ currentCompte, currentPeriode }: AnalysesTitreProps): JSX.Element => {


    return (
        // Création d'une pile pour l'affichage du titre
        <Stack direction={"row"} spacing={2} justifyContent="center" alignItems="center" alignContent={"center"}>
            <img src={"/img/banques/" + currentCompte.itemIcon} className={"compteIcon"}
                alt={currentCompte.libelle} />
            <Typography variant={"h6"} component="div" textAlign={"center"}
                justifyContent={"center"} alignContent={"center"}>
                {currentCompte.libelle}
            </Typography>
            <Typography variant={"caption"} component="div" sx={{color: "grey"}}>
                |
            </Typography>
            <Typography variant={"body2"} component="div">
                {formatPeriode(currentPeriode)}
            </Typography>
        </Stack>
    )
};

export default AnalysesTitre



export function formatPeriode(periode: AnalysesPeriodeModel): string {
    if (periode.vueAnnee) {
        return "Analyse " + (periode.periodeDebut.getFullYear() === periode.periodeFin.getFullYear() ?
            periode.periodeDebut.getFullYear()
            :
            periode.periodeDebut.getFullYear() + " - " + periode.periodeFin.getFullYear()
        );
    } else {
        return "Analyses de " + (periode.periodeDebut.getFullYear() === periode.periodeFin.getFullYear()
            && periode.periodeDebut.getMonth() === periode.periodeFin.getMonth() ?
            getLabelMonthFRFromDate(periode.periodeDebut)
            :
            getLabelMonthFRFromDate(periode.periodeDebut) + " à " +
            getLabelMonthFRFromDate(periode.periodeFin)
        );
    }
}
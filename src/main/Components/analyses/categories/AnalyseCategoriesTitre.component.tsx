import {Divider, Stack, Tooltip, Typography} from "@mui/material";
import React from "react";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import { AnalyseTitreProps } from "../../Components.props";



/**
 * Page principale pour l'affichage du solde
 * @param {Object} currentCompte - Le compte courant
 * @param {Date} currentDate - La date courante
 * @param {Number} totalOperations - Le total des opérations
 * @returns {JSX.Element} - L'élément JSX à afficher
 * @constructor
 */
const AnalyseTitre : React.FC<AnalyseTitreProps> = ({currentCompte, currentDate, totalOperations} : AnalyseTitreProps) => {


    /**
     * Obtient le tooltip pour la date d'aujourd'hui
     * @returns {string} - La date d'aujourd'hui formatée
     */
    function getTooltipAuj() {
        const dateCourante = new Date(Date.now());
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    // Rendu du composant
    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>

            <Divider orientation="vertical" flexItem/>
            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} width={195} textAlign={"right"} sx={{cursor: "help"}}>
                    <OperationValue id={"graphCategories"} valueOperation={totalOperations} showSign={true}/>
                </Typography>
            </Tooltip>
            <Divider orientation="vertical" flexItem/>
            <Stack direction={"row"} paddingLeft={45}>
                <img src={"/img/banques/" + currentCompte.itemIcon} width={50} height={50} alt={currentCompte.libelle}/>
                <Stack direction={"column"}>
                    <Typography variant={"h6"} component="div" width={300} textAlign={"center"}>
                        {currentCompte.libelle}
                    </Typography>
                    <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={300}
                                textAlign={"center"}>
                        {currentDate.toLocaleString('default', {month: 'long'}) + " " + currentDate.getFullYear()}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
};

export default AnalyseTitre

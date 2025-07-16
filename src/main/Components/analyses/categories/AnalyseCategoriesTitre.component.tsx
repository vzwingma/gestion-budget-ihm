import {Stack, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, {JSX} from "react";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import {AnalyseTitreProps} from "../../Components.props";


/**
 * Page principale pour l'affichage du solde
 * @param {Object} currentCompte - Le compte courant
 * @param currentDate date courante
 * @param totalOperations total des opérations
 * @returns {JSX.Element} - L'élément JSX à afficher
 * @constructor
 */
const AnalyseTitre: React.FC<AnalyseTitreProps> = ({
                                                       currentCompte,
                                                       currentDate,
                                                       totalOperations
                                                   }: AnalyseTitreProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /**
     * Obtient le tooltip pour la date d'aujourd'hui
     * @returns {string} - La date d'aujourd'hui formatée
     */
    function getTooltipAuj(): string {
        const dateCourante = new Date(Date.now());
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    // Rendu du composant
    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>

            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} textAlign={"right"} component="div" sx={{cursor: "help"}}
                            width={isMobile ? 250 : 350}>
                    <OperationValue id={"graphCategories"} valueOperation={totalOperations} showSign={true}/>
                </Typography>
            </Tooltip>
            <Stack direction={"row"} paddingLeft={isMobile ? 20 : 50}>
                <img src={"/img/banques/" + currentCompte.itemIcon} className={"compteIcon"}
                     alt={currentCompte.libelle}/>
                <Stack direction={isMobile ? "row" : "column"}>
                    <Typography variant={"h6"} component="div" width={isMobile ? 150 : 200} textAlign={"center"}
                                sx={{alignContent: "center", justifyContent: "center"}}>
                        {currentCompte.libelle}
                    </Typography>
                    <Typography variant={"caption"}
                                sx={{alignContent: "center", justifyContent: "center", color: "grey"}} component="div"
                                width={isMobile ? 100 : 200} textAlign={isMobile ? "left" : "center"}>
                        {currentDate.toLocaleString('default', {month: 'long'}) + " " + currentDate.getFullYear()}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
};

export default AnalyseTitre

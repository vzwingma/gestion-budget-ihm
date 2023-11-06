import OperationValue from '../../Utils/renderers/OperationValue.renderer'
import {Divider, Stack, Tooltip, Typography} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

/**
 * Page principale d'affichage du solde
 * @param currentCompte : compte courant
 * @param currentDate : date courante
 * @param totauxGroupedByEtat : array totaux
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const AnalyseTitre = ({currentCompte, currentDate, totalOperations}) => {

    AnalyseTitre.propTypes = {
        currentCompte: PropTypes.object.isRequired,
        currentDate: PropTypes.any.isRequired,
        totalOperations: PropTypes.array
    }


    function getTooltipAuj() {
        const dateCourante = new Date(Date.now());
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }


    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>

            <Divider orientation="vertical" flexItem/>
            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} width={195} textAlign={"right"} sx={{cursor: "help"}}>
                    <OperationValue valueOperation={totalOperations} showSign={true}/>
                </Typography>
            </Tooltip>
            <Divider orientation="vertical" flexItem/>
            <Stack direction={"row"} paddingLeft={45}>
                <img src={"/img/banques/" + currentCompte.icon} width={50} height={50} alt={currentCompte.libelle}/>
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

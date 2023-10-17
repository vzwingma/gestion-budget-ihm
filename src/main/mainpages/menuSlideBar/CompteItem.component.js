import React, {useEffect, useState} from 'react'
import {Container, Stack, Typography} from "@mui/material";
import OperationValue from "../../Utils/renderers/OperationValue.renderer";
import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppTechEnums.constants";
import PropTypes from "prop-types";

/**
 * Tuile affichant un compte
 * @param compte : object compte
 * @param selectedDate : date date sélectionnée
 * @param onRefreshMenuBar : function action sur refresh menu bar
 * @param onClick : function action sur click
 * @returns {JSX.Element}
 * @constructor
 */
const CompteItem = ({compte, selectedDate, onRefreshMenuBar, onClick}) => {

    const [soldes, setSoldes] = useState(null);

    /**
     Get SOLDES du budget depuis le back-end
     **/
    function getSoldesBudget(compte, selectedDate) {
        if (compte != null && selectedDate != null) {
            ClientHTTP.call('GET',
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.SOLDES,
                [compte, selectedDate.getFullYear(), selectedDate.getMonth() + 1])
                .then(data => setSoldes((prevState) => data.soldeAtMaintenant))
                .catch(e => {
                    let libErreur = "Erreur lors du chargement du budget " + compte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                    console.log(libErreur + " >> " + e)
                });
        }
    }


    useEffect(() => {
        getSoldesBudget(compte.id, selectedDate)
    }, [compte, selectedDate, onRefreshMenuBar]);


    return (
        <Container sx={{
                       padding: 1,
                       '&:hover': {
                           backgroundColor: 'primary.main',
                           color: 'white',
                           opacity: [0.8],
                           cursor: 'pointer',
                       }
                   }}
                   onClick={() => onClick(compte)}>
            <Stack direction={"row"} spacing={5}>
                <img src={"/img/banques/" + compte.icon} width={50} height={50} alt={compte.libelle}
                     key={"img_" + compte.id}/>
                <Stack direction={"column"}>
                    <Typography variant={"h6"} key={"lib_" + compte.id}>
                        {compte.libelle}
                    </Typography>
                    <Typography variant={"caption"} width={120} sx={{cursor: "help"}}>
                        <OperationValue valueOperation={soldes} showSign={true}/>
                    </Typography>
                </Stack>
            </Stack>
        </Container>

    )
};
CompteItem.propTypes = {
    compte: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    onRefreshMenuBar: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}
export default CompteItem

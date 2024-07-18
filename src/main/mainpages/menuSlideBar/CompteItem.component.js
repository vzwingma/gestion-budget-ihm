import React, {useEffect, useState} from 'react'
import {Container, Stack, Typography} from "@mui/material";
import OperationValue from "../../Utils/renderers/OperationValue.renderer";
import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppTechEnums.constants";
import PropTypes from "prop-types";
import {BUSINESS_ONGLETS} from "../../Utils/AppBusinessEnums.constants";

/**
 * Tuile affichant un compte
 * @param compte : object compte
 * @param selectedDate : date date sélectionnée
 * @param selectedFunction : string fonction sélectionnée
 * @param onRefreshMenuBar : function action sur refresh menu bar
 * @param onClick : function action sur click
 * @returns {JSX.Element}
 * @constructor
 */
const CompteItem = ({compte, selectedDate, selectedFunction, onRefreshMenuBar, onClick}) => {

    const [soldes, setSoldes] = useState(null);

    /**
     Get SOLDES du budget depuis le back-end
     **/
    function getSoldesBudget(compte, selectedDate) {
        if (compte != null && selectedDate != null) {
            ClientHTTP.call(AppConstants.METHODE_HTTP.GET,
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.SOLDES,
                [compte, selectedDate.getFullYear(), selectedDate.getMonth() + 1])
                .then(data => {
                    if (data.length > 0) {
                        setSoldes(() => data[0].soldes.soldeAtMaintenant);
                    }
                })
                .catch(e => {
                    let libErreur = "Erreur lors du chargement du budget " + compte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                    console.log(libErreur, e)
                });
        }
    }


    useEffect(() => {
        if (selectedFunction === BUSINESS_ONGLETS.BUDGET) {
            getSoldesBudget(compte.id, selectedDate)
        }
    }, [compte, selectedDate, selectedFunction, onRefreshMenuBar]);


    function renderValueCompte() {
        if (selectedFunction === BUSINESS_ONGLETS.BUDGET) {
            if (soldes != null) {
                return <Typography variant={"caption"} width={120} sx={{cursor: "help"}}>
                    <OperationValue valueOperation={soldes} showSign={true}/>
                </Typography>
            } else {
                return <Typography variant={"caption"} width={120} sx={{cursor: "help"}}>
                    <span className="text-NOT_INIT">Budget non initialisé</span>
                </Typography>
            }
        } else {
            return <></>
        }
    }
    return (
        <Container className={"listeItem"}
                   onClick={() => onClick(compte)}>
            <Stack direction={"row"} spacing={5}>
                <img src={"/img/banques/" + compte.icon} width={50} height={50} alt={compte.libelle}
                     key={"img_" + compte.id}/>
                <Stack direction={"column"}>
                    <Typography variant={"h6"} key={"lib_" + compte.id}>
                        {compte.libelle}
                    </Typography>
                    {renderValueCompte()}
                </Stack>
            </Stack>
        </Container>

    )
};
CompteItem.propTypes = {
    compte: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    selectedFunction: PropTypes.string.isRequired,
    onRefreshMenuBar: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}
export default CompteItem

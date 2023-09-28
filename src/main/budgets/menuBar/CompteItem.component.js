import React, {useEffect, useState} from 'react'
import {Container, Stack, Typography} from "@mui/material";
import OperationValue from "../operations/renderers/OperationSpanValue.renderer";
import * as ClientHTTP from "../../Services/ClientHTTP.service";
import * as AppConstants from "../../Utils/AppTechEnums.constants";

/**
 * Tuile affichant un compte
 * @param compte compte
 * @param selectedIdCompte compte sélectionné
 * @param selectedDate date sélectionnée
 * @param onClick action sur click
 * @returns {JSX.Element}
 * @constructor
 */
const CompteItem = ({compte, selectedIdCompte, selectedDate, onClick}) => {

    const [soldes, setSoldes] = useState(0);

    /**
     Get SOLDES du budget depuis le back-end
     **/
    function getSoldesBudget(selectedCompte, selectedDate) {
        if (selectedCompte != null && selectedDate != null) {
            ClientHTTP.call('GET',
                AppConstants.BACKEND_ENUM.URL_OPERATIONS, AppConstants.SERVICES_URL.BUDGETS.SOLDES,
                [selectedCompte, selectedDate.getFullYear(), selectedDate.getMonth() + 1])
                .then(data => setSoldes((prevState) => data.soldeAtMaintenant))
                .catch(e => {
                    let libErreur = "Erreur lors du chargement du budget " + selectedCompte + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                    console.log(libErreur + " >> " + e)
                });
        }
    }


    useEffect(() => {
        getSoldesBudget(compte.id, selectedDate)
    }, [compte, selectedDate, selectedIdCompte]);


    return (
        <Container key={compte.id}
                   sx={{
                       backgroundColor: (compte.id === selectedIdCompte ? 'primary.main' : 'unset'),
                       borderRadius: (compte.id === selectedIdCompte ? '5% 0% 5% 0%' : 'unset'),
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

export default CompteItem

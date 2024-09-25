import React, {useEffect, useState} from 'react'
import {Container, Stack, Typography} from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import {BUSINESS_ONGLETS} from "../../../Utils/AppBusinessEnums.constants";
import CompteBancaireModel from '../../../Models/CompteBancaire.model';
import { getSoldesBudget } from './CompteItem.controller';



interface CompteItemProps {
    compte: CompteBancaireModel;
    selectedDate: Date;
    selectedFunction: BUSINESS_ONGLETS;
    onRefreshMenuBar: boolean;
    onClick: Function;
}
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
const CompteItem : React.FC<CompteItemProps> = ({compte, selectedDate, selectedFunction, onRefreshMenuBar, onClick : handleCompteChange} : CompteItemProps): JSX.Element => {

    const [soldes, setSoldes] = useState(null as number | null);

    /**
     * Chargement des soldes du budget
     * Rechargement à chaque changement de compte ou de date
     */
    useEffect(() => {
        if (selectedFunction === BUSINESS_ONGLETS.BUDGET) {
            getSoldesBudget(compte, selectedDate, setSoldes)
        }
    }, [compte, selectedDate, selectedFunction, onRefreshMenuBar]);


    /**
     * Rendu du solde du compte
     * @returns {JSX.Element}
     * @constructor
     */
    function renderValueCompte() {
        if (selectedFunction === BUSINESS_ONGLETS.BUDGET) {
            return <Typography variant={"caption"} width={120} sx={{cursor: "help"}}>
                <OperationValue valueOperation={soldes} showSign={true}/>
            </Typography>
        } else {
            return <></>
        }
    }
    /**
     * Rendu de la tuile
     * @returns {JSX.Element}
     * @constructor
     */
    return (
        <Container className={"listeItem"}
                   onClick={() => handleCompteChange(compte)}>
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

export default CompteItem

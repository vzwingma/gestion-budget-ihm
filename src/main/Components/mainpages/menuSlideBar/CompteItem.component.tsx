import React, { JSX, useEffect, useState } from 'react'
import { CircularProgress, Container, Stack, Typography } from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer.tsx";
import { BUSINESS_ONGLETS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { getSoldesBudget } from './CompteItem.controller.ts';
import { CompteItemProps } from '../../Components.props.ts';


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
const CompteItem: React.FC<CompteItemProps> = ({ compte, selectedDate, selectedFunction, onRefreshMenuBar, onClick: handleCompteChange }: CompteItemProps): JSX.Element => {

    const [soldes, setSoldes] = useState<number | null | undefined>();

    /**
     * Chargement des soldes du budget
     * Rechargement à chaque changement de compte ou de date
     */
    useEffect(() => {
        if (selectedFunction === BUSINESS_ONGLETS.BUDGET || selectedFunction === BUSINESS_ONGLETS.RECURRENTS) {
            getSoldesBudget(compte, selectedDate, setSoldes)
        }
    }, [compte, selectedDate, selectedFunction, onRefreshMenuBar]);


    /**
     * Rendu du solde du compte
     * @returns {JSX.Element}
     * @constructor
     */
    function renderValueCompte(): JSX.Element {
        if (soldes === undefined) {
            return <CircularProgress size={20} />
        }
        else if (selectedFunction === BUSINESS_ONGLETS.BUDGET) {
            return <Typography variant={"subtitle1"} width={120} sx={{ cursor: "help" }}>
                <OperationValue valueOperation={soldes} showSign={true} id={'value' + compte.id} />
            </Typography>
        }
        else if (selectedFunction === BUSINESS_ONGLETS.RECURRENTS) {
            return <Typography variant={"subtitle1"} width={120} sx={{ cursor: "help" }}>
                { (soldes === null) && <span style={{color: "var( --color-heading-text)"}}>Non initialisé</span> }
                { (soldes !== null) && <span style={{color: 'var(--color-realisee)'}}>Actif</span> }
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
                <img src={"/img/banques/" + compte.itemIcon} className={"compteListIcon"} alt={compte.libelle}
                    key={"img_" + compte.id} />
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

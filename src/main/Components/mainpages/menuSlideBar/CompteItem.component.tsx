import React, { JSX } from 'react'
import { CircularProgress, Container, Stack, Typography } from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer.tsx";
import { BUSINESS_ONGLETS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { fetchSoldesBudget } from './CompteItem.controller.ts';
import { useFetch } from '../../../hooks/useFetch.ts';
import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import { getBanqueIconSrc } from "../../../Utils/Banque.utils.ts";

export interface CompteItemProps {
    compte: CompteBancaireModel;
    selectedCompte: CompteBancaireModel | null;
    selectedDate: Date;
    selectedFunction: BUSINESS_ONGLETS;
    onRefreshMenuBar: boolean;
    onClick: (compte : CompteBancaireModel) => void
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
const CompteItem: React.FC<CompteItemProps> = ({ compte, selectedCompte, selectedDate, selectedFunction, onRefreshMenuBar, onClick: handleCompteChange }: CompteItemProps): JSX.Element => {

    const isCompteCourant = selectedCompte?.id === compte.id;

    /**
     * Chargement des soldes du budget
     * Rechargement à chaque changement de compte ou de date
     */
    const { data: soldesCharges, loading: chargementSoldes, error: erreurSoldes } = useFetch(
        () => (selectedFunction === BUSINESS_ONGLETS.BUDGET || selectedFunction === BUSINESS_ONGLETS.RECURRENTS)
            ? fetchSoldesBudget(compte, selectedDate)
            : Promise.resolve(undefined),
        [compte, selectedDate, selectedFunction, onRefreshMenuBar]);
    /** En cas d'erreur, le solde repasse à `undefined` (indicateur de chargement) **/
    const soldes: number | null | undefined = erreurSoldes ? undefined : soldesCharges;


    /**
     * Rendu du solde du compte
     * @returns {JSX.Element}
     * @constructor
     */
    function renderValueCompte(): JSX.Element {
        if ( (selectedFunction === BUSINESS_ONGLETS.BUDGET || selectedFunction === BUSINESS_ONGLETS.RECURRENTS) && (chargementSoldes || soldes === undefined) ) {
            return <CircularProgress size={20} />
        }
        else if (selectedFunction === BUSINESS_ONGLETS.BUDGET) {
            return <Typography variant={"subtitle1"} sx={{ width: 120, cursor: "help" }}>
                <OperationValue valueOperation={soldes ?? null} showSign={true} id={'value' + compte.id} />
            </Typography>
        }
        else if (selectedFunction === BUSINESS_ONGLETS.RECURRENTS) {
            return <Typography variant={"subtitle1"} sx={{ width: 120, cursor: "help" }}>
                { (soldes === null) && <span style={{color: "var( --color-heading-text)"}}>Non initialisé</span> }
                { (soldes !== null) && <span style={{color: 'var(--color-realisee)'}}>Actif</span> }
            </Typography>

        } else {
            return <Typography variant={"subtitle1"} sx={{ width: 120, cursor: "help" }}>
                { (!compte.actif) && <span style={{color: "var( --color-heading-text)"}}>Inactif</span> }
                { (compte.actif) && <span style={{color: 'var(--color-realisee)'}}>Actif</span> }
            </Typography>
        }
    }
    /**
     * Rendu de la tuile
     * @returns {JSX.Element}
     * @constructor
     */
    return (
        <Container className={"listeItem" + (isCompteCourant ? " listeItem--selected" : "")}
            onClick={() => handleCompteChange(compte)}>
            <Stack direction={"row"} spacing={5}>
                <img src={getBanqueIconSrc(compte.itemIcon)} className={"compteListIcon"} alt={compte.libelle}
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

// AP 006 - T8 : composant rendu en boucle (une tuile par compte dans la menubar).
export default React.memo(CompteItem)

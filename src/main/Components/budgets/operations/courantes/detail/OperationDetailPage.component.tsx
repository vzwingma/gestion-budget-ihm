import React, { JSX } from 'react'
import { Container, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";

import { isInCreateMode } from './OperationDetailPage.controller.ts';
import { OPERATION_EDITION_FORM } from './OperationDetailPage.constants.ts';
import { OperationDetailValeur } from './subcomponents/OperationDetailValeur.component.tsx';
import { OperationDetailLibelle } from './subcomponents/OperationDetailLibelle.component.tsx';
import { OperationDetailHeader } from './subcomponents/OperationDetailHeader.component.tsx';
import { OperationDetailCategoriesSection } from './subcomponents/OperationDetailCategoriesSection.component.tsx';
import { OperationDetailMensualiteSection } from './subcomponents/OperationDetailMensualiteSection.component.tsx';
import { OperationDetailEtatSection } from './subcomponents/OperationDetailEtatSection.component.tsx';
import { OperationDetailActionsSection } from './subcomponents/OperationDetailActionsSection.component.tsx';
import { useBudgetContext } from '../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import { useOperationEditForm } from './useOperationEditForm.ts';
import CategorieOperationModel from "../../../../../Models/budgets/CategorieOperation.model.ts";
import BudgetMensuelModel from "../../../../../Models/budgets/BudgetMensuel.model.ts";
import LibelleCategorieOperationModel from "../../../../../Models/budgets/LibelleCategorieOperation.model.ts";

export interface OperationDetailPageProps {
    listeCategories: CategorieOperationModel[]
    listeLibellesOperations: LibelleCategorieOperationModel[]
    onOperationChange: (budget: BudgetMensuelModel) => void
}


/**
 * Composant de page de détail d'une opération.
 *
 * Ce composant affiche les détails d'une opération et permet de modifier ses informations.
 * L'état du formulaire d'édition (champs ouverts, copie de travail, erreurs, validation, sauvegarde)
 * est porté par le hook `useOperationEditForm` ; le composant ne garde que le rendu.
 * @returns {JSX.Element} - Le composant de page de détail d'une opération.
 */
export const OperationDetailPage: React.FC<OperationDetailPageProps> = ({
    listeCategories,
    listeLibellesOperations,
    onOperationChange
}: OperationDetailPageProps): JSX.Element => {

    const { currentBudget: budget, currentOperation: operation } = useBudgetContext();
    const { editForm, editOperation, errors, resetKey, fillOperationForm, handleClick, validate, setEtatInCreation, commitOperation } =
        useOperationEditForm({ listeCategories, onOperationChange });

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    if (!operation || !budget) {
        return <></>;
    }

    const inCreateMode = isInCreateMode(editForm);

    /**
     * RENDER
     * @returns {JSX.Element}
     */
    return (
        <Container id={OPERATION_EDITION_FORM.FORM}
            component="div" fixed
            onClick={handleClick}
            onKeyUp={handleClick}>

            <Stack direction={"column"} sx={{ justifyContent: isMobile ? "none" : "center", paddingTop: isMobile ? "15px" : "10vh" }}>
                <Stack direction={"column"} spacing={isMobile ? 1 : 4} className="budget-page-container"
                    sx={{ alignItems: "center", justifyContent: "center", padding: isMobile ? "15px" : "30px", backgroundColor: "var(--color-dark-container)" }}>

                    <OperationDetailHeader editOperation={editOperation} statuts={operation.statuts} />

                    <Grid container sx={{ width: "90%", alignItems: "center", justifyContent: "center" }}>
                        { /** VALEUR **/}
                        <OperationDetailValeur key={resetKey} formValueInEdition={editForm.value}
                            errorValeur={errors.valeur}
                            typeOperation={editOperation.typeOperation ?? undefined}
                            fillOperationForm={fillOperationForm} />
                    </Grid>
                    <Grid container sx={{ width: "90%", alignItems: "center", justifyContent: "center" }}>
                        { /** LIBELLE **/}
                        <OperationDetailLibelle
                            listeLibellesOperations={listeLibellesOperations}
                            formLibelleInEdition={editForm.libelle}
                            errorLibelle={errors.libelle}
                            fillOperationForm={fillOperationForm} />
                    </Grid>

                    <Grid container columnSpacing={2} rowSpacing={isMobile ? 1 : 2} sx={{ width: "90%", borderTop: inCreateMode ? 'none' : '1px solid var(--color-operations-primary)', paddingTop: 2 }}>
                        { /** CATEGORIES **/}
                        <OperationDetailCategoriesSection listeCategories={listeCategories}
                            editForm={editForm} errors={errors} editOperation={editOperation}
                            fillOperationForm={fillOperationForm} isMobile={isMobile} />

                        { /** MENSUALITES **/}
                        <OperationDetailMensualiteSection resetKey={resetKey}
                            editForm={editForm} errors={errors} editOperation={editOperation}
                            fillOperationForm={fillOperationForm} isMobile={isMobile} />

                        { /** ETATS **/}
                        <OperationDetailEtatSection resetKey={resetKey}
                            etat={inCreateMode ? editOperation.etat : operation.etat}
                            editForm={editForm} errors={errors} editOperation={editOperation}
                            fillOperationForm={fillOperationForm} isMobile={isMobile} />
                    </Grid>

                    { /** ACTIONS **/}
                    <OperationDetailActionsSection editForm={editForm} editOperation={editOperation}
                        onClickRealiseInCreateMode={setEtatInCreation}
                        onOperationChange={onOperationChange}
                        onOperationCommit={commitOperation}
                        onValidate={validate} />
                </Stack>
            </Stack>
        </Container>
    )
}

export default OperationDetailPage

import React, { JSX } from 'react'
import { Grid, Typography } from "@mui/material";
import { OperationDetailCategories } from './OperationDetailCategories.component.tsx';
import { OperationDetailCategorieType } from './OperationDetailCategorieType.component.tsx';
import { getAffichageIntercompteRO, OperationDetailIntercompte } from './OperationDetailIntercompte.component.tsx';
import { BUSINESS_GUID } from '../../../../../../Utils/AppBusinessEnums.constants.ts';
import CompteBancaireModel from '../../../../../../Models/budgets/CompteBancaire.model.ts';
import { useBudgetContext } from '../../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import { OperationDetailCategoriesSectionProps } from '../../../../../Components.props.ts';
import { isInCreateMode } from '../OperationDetailPage.controller.ts';

/**
 * Section « Catégories » de la page de détail : catégorie, type de catégorie et compte de transfert (virement interne)
 * (éléments de grille, à insérer dans un `Grid container`)
 */
export const OperationDetailCategoriesSection: React.FC<OperationDetailCategoriesSectionProps> = ({
    listeCategories, editForm, errors, editOperation, fillOperationForm, isMobile
}: OperationDetailCategoriesSectionProps): JSX.Element => {

    const { currentBudget, comptes } = useBudgetContext();
    const autresComptes = comptes.filter((compte: CompteBancaireModel) => currentBudget?.idCompteBancaire !== compte.id);

    return (
        <>
            <Grid size={{ md: 8, xl: 8 }}>
                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Catégorie</Typography>
            </Grid>
            <Grid size={{ md: 4, xl: 4 }}>
                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Type Catégorie</Typography>
            </Grid>

            <Grid size={{ md: 8, xl: 8 }}>
                {  /** CATEGORIES **/}
                <OperationDetailCategories
                    listeCategories={listeCategories}
                    formCatgoriesInEdition={editForm.categories}
                    errorsCategories={errors.categorie}
                    ssCategorieInEdition={editOperation.ssCategorie}
                    fillOperationForm={fillOperationForm} />
            </Grid>
            <Grid size={{ md: 4, xl: 4 }} >
                { /** Détail catégorie **/}
                <OperationDetailCategorieType
                    formCategorieTypeInEdition={editForm.categorieType}
                    editOperation={editOperation}
                    fillOperationForm={fillOperationForm} />
            </Grid>

            { /** COMPTE DE TRANSFERT **/}
            {BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE === editOperation.ssCategorie.id &&
                <>
                    <Grid size={{ md: 12, xl: 12 }}>
                        <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Compte de transfert</Typography>
                    </Grid>
                    <Grid size={{ md: 12, xl: 12 }}>
                        {isInCreateMode(editForm) ?
                            <OperationDetailIntercompte intercompte={editOperation.intercompte}
                                listeAutresComptes={autresComptes}
                                errorIntercompte={errors.intercompte}
                                fillOperationForm={fillOperationForm} />
                            : getAffichageIntercompteRO(editOperation.libelle, autresComptes, isMobile)}
                    </Grid>
                </>
            }
        </>
    )
}

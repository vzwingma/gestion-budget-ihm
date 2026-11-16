import BudgetMensuelModel from "../Models/budgets/BudgetMensuel.model.ts";

const NOMS_MOIS: readonly string[] = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

/**
 * Numéro du mois (1-12) à partir du champ `mois` du budget : nom Java (`"MARCH"`) ou numéro
 * déjà 1-12 (`Month.getValue()`) — forme exacte à confirmer en QUA (ADR 008 serverless).
 */
function moisNumerique(mois: string | number | undefined): number | undefined {
    if (typeof mois === "number") {
        return mois;
    }
    if (typeof mois === "string") {
        const index = NOMS_MOIS.indexOf(mois.toUpperCase());
        return index === -1 ? undefined : index + 1;
    }
    return undefined;
}

/** Mois/année extraits du suffixe `_AAAA_MM` de l'id du budget (`BudgetMensuel.getBudgetId`, backend) **/
function moisAnneeDepuisId(id: string): { mois: number; annee: number } | undefined {
    const match = /_(\d{4})_(\d{2})$/.exec(id);
    if (!match) {
        return undefined;
    }
    return { annee: Number(match[1]), mois: Number(match[2]) };
}

/**
 * Le budget reçu correspond-il au mois de `date` ?
 *
 * Compare `annee`/`mois` du budget (ADR 008 serverless) ; à défaut (champs absents, ou `mois`
 * non reconnu), se rabat sur le suffixe `_AAAA_MM` de l'id. Si ni l'un ni l'autre n'est
 * exploitable, renvoie `true` (comportement inerte : pas de bandeau affiché à tort).
 *
 * Cas d'usage (IHM AP011, décision 👤 C2) : un compte inactif sans budget pour le mois demandé
 * reçoit le dernier budget disponible, d'un mois antérieur — ce budget échoue ce test.
 */
export function estBudgetDuMois(budget: BudgetMensuelModel, date: Date): boolean {
    const moisAttendu = date.getMonth() + 1;
    const anneeAttendue = date.getFullYear();

    const mois = moisNumerique(budget.mois);
    if (mois !== undefined && budget.annee !== undefined) {
        return mois === moisAttendu && budget.annee === anneeAttendue;
    }

    const depuisId = moisAnneeDepuisId(budget.id);
    if (depuisId) {
        return depuisId.mois === moisAttendu && depuisId.annee === anneeAttendue;
    }

    return true;
}

/**
 * Libellé `MM/AAAA` du mois/année réels du budget (champs `mois`/`annee`, ou repli sur le
 * suffixe `_AAAA_MM` de l'id) — utilisé par le bandeau « Compte inactif » (IHM AP011, décision C2).
 */
export function libelleMoisAnneeBudget(budget: BudgetMensuelModel): string {
    const mois = moisNumerique(budget.mois);
    if (mois !== undefined && budget.annee !== undefined) {
        return String(mois).padStart(2, "0") + "/" + budget.annee;
    }

    const depuisId = moisAnneeDepuisId(budget.id);
    if (depuisId) {
        return String(depuisId.mois).padStart(2, "0") + "/" + depuisId.annee;
    }

    return "";
}

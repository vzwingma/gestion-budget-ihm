import React, {JSX} from "react";
import {Box, Chip} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {OPERATION_ETATS_ENUM} from "../../../Utils/AppBusinessEnums.constants.ts";
import {getOperationStateColor, getOperationStateLabel} from "../../../Utils/renderers/OperationItem.renderer.tsx";
import {PUCE_ETAT_ENUM, PUCE_SENS_ENUM, PucesFiltre, togglePuce} from "../../../Utils/OperationsFilter.utils.ts";

/** Hauteur visuelle des puces (px) ; la zone cliquable est étendue à 44 px (cf. `::after`, 28 + 2 x 8) */
export const FILTER_CHIP_HEIGHT = 28;

/**
 * Couleur de la puce « À valider » : elle combine PREVUE (orange) et REPORTEE (violet) ; une couleur neutre
 * dédiée (gris-bleu, contraste ≈ 7:1 sur fond sombre) évite une puce bicolore. Couleurs d'état inchangées.
 */
export const COULEUR_PUCE_A_VALIDER = "#90a4ae";

interface PuceConfig<T> {
    valeur: T;
    label: string;
    couleur: string;
}

const PUCES_ETAT: PuceConfig<PUCE_ETAT_ENUM>[] = [
    {valeur: PUCE_ETAT_ENUM.A_VALIDER, label: "À valider", couleur: COULEUR_PUCE_A_VALIDER},
    {valeur: PUCE_ETAT_ENUM.REALISEE, label: getOperationStateLabel(OPERATION_ETATS_ENUM.REALISEE), couleur: getOperationStateColor(OPERATION_ETATS_ENUM.REALISEE)},
    {valeur: PUCE_ETAT_ENUM.ANNULEE, label: getOperationStateLabel(OPERATION_ETATS_ENUM.ANNULEE), couleur: getOperationStateColor(OPERATION_ETATS_ENUM.ANNULEE)}
];

const PUCES_SENS: PuceConfig<PUCE_SENS_ENUM>[] = [
    {valeur: PUCE_SENS_ENUM.DEPENSES, label: "Dépenses", couleur: "var(--color-depense)"},
    {valeur: PUCE_SENS_ENUM.RENTREES, label: "Rentrées", couleur: "var(--color-credit)"}
];

interface FilterChipsProps {
    /** Puces actuellement actives */
    puces: PucesFiltre;
    onChange: (puces: PucesFiltre) => void;
}

interface FilterChipProps {
    label: string;
    couleur: string;
    selected: boolean;
    onToggle: () => void;
}

/**
 * Puce de filtre : bordure à la couleur de l'état ; sélection = coche + fond + graisse (jamais la couleur seule)
 */
const FilterChip: React.FC<FilterChipProps> = ({label, couleur, selected, onToggle}: FilterChipProps): JSX.Element => (
    <Chip
        clickable
        label={label}
        onClick={onToggle}
        aria-pressed={selected}
        variant="outlined"
        icon={selected
            ? <CheckIcon/>
            : <Box component="span" aria-hidden="true"
                   sx={{width: 6, height: 6, borderRadius: "50%", backgroundColor: couleur, flexShrink: 0}}/>}
        sx={{
            position: "relative",
            height: FILTER_CHIP_HEIGHT,
            borderRadius: `${FILTER_CHIP_HEIGHT / 2}px`,
            border: `1.5px solid ${couleur}`,
            color: "#f0f0f0",
            fontWeight: selected ? 700 : 400,
            fontSize: "0.6875rem",
            backgroundColor: selected ? "rgba(255,255,255,0.16)" : "transparent",
            // les puces se répartissent la largeur du conteneur (jamais de retour à la ligne ni de débordement)
            flex: "1 1 auto",
            minWidth: 0,
            "& .MuiChip-label": {px: "5px"},
            "& .MuiChip-icon": {ml: "6px", mr: "-2px", color: couleur, fontSize: "0.875rem"},
            // zone cliquable étendue à 44 px de haut
            "&::after": {content: '""', position: "absolute", top: -8, bottom: -8, left: 0, right: 0}
        }}
    />
);

/**
 * Puces de filtre orientées validation (AP 005 - Phase 4) : « État » (À valider / Réalisée / Annulée)
 * et « Sens » (Dépenses / Rentrées), combinables. Pas de logique de filtrage ici (cf. `OperationsFilter.utils.ts`).
 */
const FilterChips: React.FC<FilterChipsProps> = ({puces, onChange}: FilterChipsProps): JSX.Element => (
    <Box role="group" aria-label="Filtres des opérations" sx={{display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "4px", width: "100%"}}>
        {PUCES_ETAT.map((puce: PuceConfig<PUCE_ETAT_ENUM>) => (
            <FilterChip key={puce.valeur} label={puce.label} couleur={puce.couleur}
                        selected={puces.etats.includes(puce.valeur)}
                        onToggle={() => onChange({...puces, etats: togglePuce(puces.etats, puce.valeur)})}/>
        ))}
        {PUCES_SENS.map((puce: PuceConfig<PUCE_SENS_ENUM>) => (
            <FilterChip key={puce.valeur} label={puce.label} couleur={puce.couleur}
                        selected={puces.sens.includes(puce.valeur)}
                        onToggle={() => onChange({...puces, sens: togglePuce(puces.sens, puce.valeur)})}/>
        ))}
    </Box>
);

export default FilterChips;

import {useMediaQuery} from "@mui/material";

/**
 * Détecte un appareil dont le pointeur principal est tactile et sans survol (tablette, mobile).
 * Basé sur les media queries `(hover: none)` + `(pointer: coarse)` et non sur le breakpoint :
 * une fenêtre desktop étroite (souris) garde le survol, une tablette large passe en mode tap.
 * @returns {boolean} true si l'appareil est tactile sans survol
 */
export function useIsTouchDevice(): boolean {
    return useMediaQuery('(hover: none) and (pointer: coarse)');
}

/**
 * Les interfaces de props ne sont plus centralisées ici (plan 006, T16).
 *
 * Convention : chaque interface de props est définie à côté du composant qui la consomme
 * (fichier `*.component.tsx`), ou dans un fichier `*.props.ts` voisin lorsqu'elle est partagée
 * entre plusieurs composants d'une même feature. Seuls les types réellement transverses
 * (utilisés par plusieurs features) ont vocation à être placés ici.
 *
 * Fichier conservé vide (aucun type transverse à date) : suppression proposée à 👤.
 */
export {};

import React, { JSX } from "react";
import { useAuthTokenSync } from "../../hooks/useAuthTokenSync.ts";

/**
 * Composant technique, sans rendu, montant `useAuthTokenSync` une seule fois au niveau racine
 * de l'application (dans l'arbre de `AuthProvider`), indépendamment du cycle de vie d'un
 * composant de page (cf. `Profile.component.tsx`, anciennement seul point de resynchronisation).
 */
const AuthTokenSync: React.FC = (): JSX.Element => {
    useAuthTokenSync();
    return <></>;
}

export default AuthTokenSync;

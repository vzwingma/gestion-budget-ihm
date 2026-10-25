import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { putTokenInStorage, removeTokenFromStorage } from "../Services/Auth.service.ts";

/**
 * Synchronise le token OIDC (id_token) dans le localStorage, indépendamment du cycle de vie
 * d'un composant de page particulier.
 *
 * A monter une seule fois au niveau racine de l'application (ex: dans `Main.tsx`, à l'intérieur
 * du `AuthProvider`). Avant cette extraction, seul `Profile.component.tsx` synchronisait le
 * token (au montage), ce qui laissait le token périmé en localStorage si ce composant n'était
 * pas monté au moment du renouvellement silencieux (`automaticSilentRenew`).
 *
 * Ecoute directement les événements du `UserManager` sous-jacent (`addUserLoaded`, déclenché à
 * la connexion initiale ET à chaque renouvellement silencieux réussi ; `addUserUnloaded`,
 * déclenché à la déconnexion) plutôt que de dépendre du rendu d'un composant de page.
 */
export function useAuthTokenSync(): void {
    const auth = useAuth();

    useEffect(() => {
        // Synchronisation immédiate si une session est déjà active au montage
        if (auth.isAuthenticated && auth.user?.id_token) {
            putTokenInStorage(auth.user.id_token);
        }
    }, [auth.isAuthenticated, auth.user]);

    useEffect(() => {
        // le `return` est important : addUserLoaded() renvoie une fonction de nettoyage
        return auth.events.addUserLoaded((user) => {
            putTokenInStorage(user.id_token);
        });
    }, [auth.events]);

    useEffect(() => {
        return auth.events.addUserUnloaded(() => {
            removeTokenFromStorage();
        });
    }, [auth.events]);
}

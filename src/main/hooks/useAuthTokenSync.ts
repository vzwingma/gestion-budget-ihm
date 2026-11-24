import { useEffect, useLayoutEffect } from "react";
import { useAuth } from "react-oidc-context";
import { getOAuthToken, marquerSessionExpiree, putTokenInStorage, removeTokenFromStorage } from "../Services/Auth.service.ts";
import { estDeconnexionEnCours, setGestionnaireDeconnexion, verifierSessionExpiree } from "../Services/ClientHTTP.service.ts";

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

    useLayoutEffect(() => {
        // Synchronisation immédiate si une session est déjà active au montage
        if (!estDeconnexionEnCours() && auth.isAuthenticated && auth.user?.id_token) {
            putTokenInStorage(auth.user.id_token);
        }
    }, [auth.isAuthenticated, auth.user]);

    useEffect(() => {
        // le `return` est important : addUserLoaded() renvoie une fonction de nettoyage
        return auth.events.addUserLoaded((user) => {
            if (!estDeconnexionEnCours()) {
                putTokenInStorage(user.id_token);
            }
        });
    }, [auth.events]);

    useEffect(() => {
        return auth.events.addUserUnloaded(() => {
            removeTokenFromStorage();
        });
    }, [auth.events]);

    const removeUser = auth.removeUser;
    useLayoutEffect(() => {
        // Gestionnaire de déconnexion appelé (une seule fois) par ClientHTTP sur un 401 / 403 :
        // drapeau « session expirée » (toast au retour sur l'accueil), suppression de l'utilisateur OIDC
        // (évite une boucle de rechargement), puis retour à l'accueil.
        setGestionnaireDeconnexion(() => {
            marquerSessionExpiree();
            removeTokenFromStorage();
            removeUser()
                .catch((e) => console.warn("Erreur lors de la suppression de l'utilisateur OIDC", e))
                .finally(() => {
                    globalThis.location.href = "/";
                });
        });
        // Pas de réarmement de la garde : une déconnexion lancée se termine par un rechargement de page
        return () => setGestionnaireDeconnexion();
    }, [removeUser]);

    useLayoutEffect(() => {
        // La restauration et le callback OIDC ne sont pas une preuve d'expiration.
        if (auth.isLoading || auth.activeNavigator) {
            return;
        }
        const verifier = () => verifierSessionExpiree(getOAuthToken() ?? auth.user?.id_token ?? null);
        const verifierVisibilite = () => {
            if (document.visibilityState === "visible") {
                verifier();
            }
        };
        const intercepter = (event: Event) => {
            if (verifier()) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };
        // Capture au niveau window, avant les handlers métier React et les actions natives.
        const interactions = [
            "pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick",
            "contextmenu", "keydown", "keypress", "keyup", "submit"
        ];
        window.addEventListener("focus", verifier);
        document.addEventListener("visibilitychange", verifierVisibilite);
        interactions.forEach(type => window.addEventListener(type, intercepter, true));
        verifier();
        return () => {
            window.removeEventListener("focus", verifier);
            document.removeEventListener("visibilitychange", verifierVisibilite);
            interactions.forEach(type => window.removeEventListener(type, intercepter, true));
        };
    }, [auth.isLoading, auth.activeNavigator, auth.user]);

    useEffect(() => {
        // Mesure du renouvellement silencieux (ADR 008 : A2 reportée)
        return auth.events.addSilentRenewError((error) => {
            console.warn("Échec du renouvellement silencieux de la session", error);
        });
    }, [auth.events]);
}


/**
 * Controller Select Comptes
 */

    /**
     *  Sélection d'un compte
     * @param compte compte sélectionné
     */
    export function handleSelect(compte) {
        console.log("Changement de compte : " + compte.text)
        // Compte sélectionné, remonté à budget
        this.props.onCompteChange(compte.value);
        this.setState({ selectedCompte: compte });
    }


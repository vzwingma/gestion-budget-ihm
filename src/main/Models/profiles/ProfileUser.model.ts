
/**
 * Model pour les analyse des catégories
 */
class ProfileUserModel {
    idUtilisateur: string;
    droit: string | null;
    preference: string | null;
    lastAccessTime: number;   

    /**
     * Constructor
     */
    constructor(idUtilisateur: string, droit: string | null, preference: string | null, lastAccessTime: number) {
        this.idUtilisateur = idUtilisateur;
        this.droit = droit;
        this.preference = preference;
        this.lastAccessTime = lastAccessTime;
    }
}
export default ProfileUserModel
    
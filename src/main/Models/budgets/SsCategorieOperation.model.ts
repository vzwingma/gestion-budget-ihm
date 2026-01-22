import { TYPES_CATEGORIES_OPERATION_ENUM } from "../../Utils/AppBusinessEnums.constants.ts";
import CategorieOperationModel from "./CategorieOperation.model.ts";

/**
 * Ss Catégorie Opérations model
 */
interface SsCategorieOperationModel {

    id: string | null;
    libelle: string;
    categorieParente?: CategorieOperationModel;
    type?: TYPES_CATEGORIES_OPERATION_ENUM | null;
}
export default SsCategorieOperationModel;  // export default is used to export a single class, function or primitive from a script file.

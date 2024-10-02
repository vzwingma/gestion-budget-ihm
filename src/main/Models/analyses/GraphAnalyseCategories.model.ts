import CategorieOperationModel from "../CategorieOperation.model";

class GraphAnalyseCategories {
    id: string;
    categorie: CategorieOperationModel;
    name: string;
    value: number;

    /**
     * Constructor
     */
    constructor(id: string, categorie: CategorieOperationModel, name: string, value: number) {
        this.id = id;
        this.categorie = categorie;
        this.name = name;
        this.value = value;
    }
}
export default GraphAnalyseCategories

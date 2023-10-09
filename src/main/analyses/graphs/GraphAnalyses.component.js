import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";


/**
 * Graphique Analyses
 * @param typeAnalyse : string type d'analyse
 * @param analysesGroupedByCategories : array analyses graoupée par catégories
 * @returns {JSX.Element} graphiques
 * @constructor
 */
const GraphAnalyses = ({typeAnalyse, analysesGroupedByCategories}) => {


    let dataCategories = [];
    let dataSsCategories = [];

    /** Init du tableau pour l'affichage du graphique **/
    function populatesGraph() {

        for (let categorieId in analysesGroupedByCategories) {

            if (analysesGroupedByCategories[categorieId].nbTransactions[typeAnalyse] > 0) {

                let resume = analysesGroupedByCategories[categorieId];
                dataCategories.push({
                    name: resume.categorie.libelle,
                    value: Math.abs(resume.total[typeAnalyse]),
                    color: resume.couleurCategorie
                })

                for (let idSsCategorie in resume.resumesSsCategories) {
                    let ssResume = resume.resumesSsCategories[idSsCategorie]

                    if (ssResume.nbTransactions[typeAnalyse] > 0) {
                        dataSsCategories.push({
                            name: ssResume.categorie.libelle,
                            value: Math.abs(ssResume.total[typeAnalyse]),
                            color: resume.couleurCategorie
                        })
                    }
                }

            }
        }
    }

    populatesGraph();

    return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={800} height={800}>
                    <Pie data={dataCategories} dataKey="value" cx="50%" cy="50%" innerRadius={100} outerRadius={250}>
                        {
                            dataCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color + "5A"}/>
                            ))
                        }
                    </Pie>
                    <Pie data={dataSsCategories} dataKey="value" cx="50%" cy="50%" innerRadius={270} outerRadius={350}
                         label>
                        {
                            dataSsCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color + "5A"}/>
                            ))
                        }
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
    );
}

export default GraphAnalyses

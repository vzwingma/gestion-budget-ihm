import { DataTemporelleMois } from "./GraphAnalyseMensuel.model";

export interface DataTemporelleAnnee {
    datasTemporellesMois: { [key: string]: DataTemporelleMois }
}
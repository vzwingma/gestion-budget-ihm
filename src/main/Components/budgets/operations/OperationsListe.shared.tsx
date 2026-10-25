import React, {JSX} from 'react'
import {Container, Divider, Stack, useMediaQuery, useTheme} from "@mui/material";
import { CenterComponent } from '../../shared/CenterComponent.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { getHeightList } from '../../../Utils/renderers/ListData.renderer.utils.tsx';
import { matchesPuces, PucesFiltre } from '../../../Utils/OperationsFilter.utils.ts';

/**
 * Props for the shared operations list component
 */
interface SharedOperationsListeProps {
    operationsGrouped: {[key: string]: OperationModel[]};
    filterOperations: string | null;
    /** Puces de filtre actives (état / sens) ; absent = aucune puce (liste récurrente) */
    filterPuces?: PucesFiltre;
    /** Hauteur (px) réservée dans l'en-tête de page en plus du calcul standard (barre de filtres) */
    reservedHeight?: number;
    onClick: (operation: OperationModel) => void;
    renderItem: (operation: OperationModel, onClick: (operation: OperationModel) => void) => JSX.Element;
    getSeparatorStyle?: (key: string) => { color?: string };
    /** En-tête de groupe personnalisé (opérations filtrées du groupe) ; null = aucun en-tête. Absent = séparateur par défaut. */
    renderGroupHeader?: (groupKey: string, operationsFiltered: OperationModel[]) => JSX.Element | null;
}

/**
 * Filter operations based on search criteria
 * @param operations array of operations to filter
 * @param filterOperations search term (libellé, catégorie, sous-catégorie)
 * @param puces optional chips (état / sens) : ET avec le texte, OU à l'intérieur d'un groupe, aucune puce = pas de filtrage
 * @returns filtered array of operations
 */
export function filterOperationsList(operations: OperationModel[], filterOperations: string | null, puces?: PucesFiltre): OperationModel[] {
    return operations.filter((operation: OperationModel) =>
        (filterOperations === null
        || filterOperations === ""
        || operation.libelle.toLowerCase().includes(filterOperations.toLowerCase())
        || operation.categorie.libelle.toLowerCase().includes(filterOperations.toLowerCase())
        || operation.ssCategorie.libelle.toLowerCase().includes(filterOperations.toLowerCase()))
        && (puces === undefined || matchesPuces(operation, puces))
    );
}

/**
 * Iterate through grouped operations and render them
 * @param operationsGrouped operations grouped by key (date or periodicity)
 * @param filterOperations search term
 * @param filterPuces optional chips (état / sens)
 * @param handleOperationSelect callback for operation selection
 * @param renderItem function to render individual operation items
 * @param getSeparatorStyle optional function to get separator styling
 * @param renderGroupHeader optional custom group header renderer
 * @returns array of JSX elements
 */
function iterateOperations(
    operationsGrouped: {[key: string]: OperationModel[]},
    filterOperations: string | null,
    filterPuces: PucesFiltre | undefined,
    handleOperationSelect: (operation: OperationModel) => void,
    renderItem: (operation: OperationModel, onClick: (operation: OperationModel) => void) => JSX.Element,
    getSeparatorStyle?: (key: string) => { color?: string },
    renderGroupHeader?: (groupKey: string, operationsFiltered: OperationModel[]) => JSX.Element | null
): JSX.Element[] {
    let renderList = [] as JSX.Element[];

    for (let groupKey in operationsGrouped) {
        const operationsFiltered = filterOperationsList(operationsGrouped[groupKey], filterOperations, filterPuces);

        if (renderGroupHeader) {
            const header = operationsFiltered.length > 0 ? renderGroupHeader(groupKey, operationsFiltered) : null;
            if (header) {
                renderList.push(<React.Fragment key={"liste_" + groupKey}>{header}</React.Fragment>);
            }
        } else if (groupKey !== null && groupKey !== "null" && operationsFiltered.length > 0) {
            const style = getSeparatorStyle ? getSeparatorStyle(groupKey) : {};
            renderList.push(
                <Container key={"liste_" + groupKey}
                           className={"listeItemSeparator"}
                           style={style}>
                    <CenterComponent><>{groupKey}</></CenterComponent>
                </Container>
            );
        }

        operationsFiltered.forEach((operation) => 
            renderList.push(renderItem(operation, handleOperationSelect))
        );
    }
    
    return renderList;
}

/**
 * Shared operations list component
 * @param operationsGrouped operations grouped by key (date or periodicity)
 * @param filterOperations search filter
 * @param filterPuces optional chips (état / sens)
 * @param reservedHeight hauteur réservée par la barre de filtres dans l'en-tête (px)
 * @param onClick callback for operation selection
 * @param renderItem function to render individual operation items
 * @param getSeparatorStyle optional function to get separator styling
 * @param renderGroupHeader optional custom group header renderer
 * @returns JSX.Element
 */
const SharedOperationsListe: React.FC<SharedOperationsListeProps> = ({
    operationsGrouped,
    filterOperations,
    filterPuces,
    reservedHeight = 0,
    onClick: handleOperationSelect,
    renderItem,
    getSeparatorStyle,
    renderGroupHeader
}: SharedOperationsListeProps): JSX.Element => {

    return (
        <Stack divider={<Divider orientation="horizontal"/>}
               className="operationsListeScrollable"
               sx={{
                   overflowY: "auto",
                   overflowX: "hidden",
                   scrollbarGutter: "stable",
                   height: getHeightList(useMediaQuery(useTheme().breakpoints.down('lg')), reservedHeight)
               }}>
            {iterateOperations(operationsGrouped, filterOperations, filterPuces, handleOperationSelect, renderItem, getSeparatorStyle, renderGroupHeader)}
        </Stack>
    );
};

export default SharedOperationsListe;

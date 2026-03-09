import React, { JSX, useMemo, useState } from 'react'
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { AnalyseOperationsListeProps } from '../../Components.props.ts';
import { Box, Grid, TableSortLabel, useMediaQuery, useTheme } from '@mui/material';
import { NoDataComponent } from '../../shared/NoDataComponent.tsx';
import AnalyseOperationItem from './AnalyseOperationItem.component.tsx';
import { compareNumberValues, compareStringValues, SortDirection } from '../../../Utils/OperationData.utils.ts';

type SortColumn = 'type' | 'date' | 'libelle' | 'valeur';

const getInitialSortDirection = (column: SortColumn): SortDirection => {
    if (column === 'valeur' || column === 'date') {
        return 'desc';
    }
    return 'asc';
};

const getOperationDateSortValue = (operation: OperationModel): number => {
    if (!operation.autresInfos.dateOperation) {
        return 0;
    }

    const dateValue = new Date(operation.autresInfos.dateOperation).getTime();
    return Number.isNaN(dateValue) ? 0 : dateValue;
};

const compareOperations = (
    ope1: OperationModel,
    ope2: OperationModel,
    column: SortColumn,
    direction: SortDirection
): number => {
    switch (column) {
        case 'type':
            return compareStringValues((ope1.ssCategorie.type || '').toString(), (ope2.ssCategorie.type || '').toString(), direction);
        case 'date':
            return compareNumberValues(getOperationDateSortValue(ope1), getOperationDateSortValue(ope2), direction);
        case 'libelle':
            return compareStringValues(ope1.libelle || '', ope2.libelle || '', direction);
        case 'valeur':
            return compareNumberValues(ope1.valeur || 0, ope2.valeur || 0, direction);
        default:
            return 0;
    }
};


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
const AnalyseOperationsListe: React.FC<AnalyseOperationsListeProps> = ({ operations }): JSX.Element => {
    const [sortColumn, setSortColumn] = useState<SortColumn>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    const handleSortChange = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            return;
        }

        setSortColumn(column);
        setSortDirection(getInitialSortDirection(column));
    };

    const sortedOperations = useMemo(
        () => [...operations].sort((ope1, ope2) => compareOperations(ope1, ope2, sortColumn, sortDirection)),
        [operations, sortColumn, sortDirection]
    );

    const renderSortLabel = (column: SortColumn, label: string) => (
        <TableSortLabel
            active={sortColumn === column}
            direction={sortColumn === column ? sortDirection : getInitialSortDirection(column)}
            onClick={() => handleSortChange(column)}
        >
            {label}
        </TableSortLabel>
    );

    if (!operations || operations.length === 0) {
        return <NoDataComponent />;
    }

    return (<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'var(--color-dark-container)',
                borderBottom: '1px solid var(--color-border)'
            }}
        >
            <Grid container height={isMobile ? 36 : 42} alignItems="center">
                <Grid
                    size={{ md: 1.5, xl: 1.5 }}
                    sx={{
                        paddingLeft: isMobile ? '4px' : '10px',
                        display: 'flex',
                        justifyContent: 'flex-start'
                    }}
                >
                    <Box
                        sx={{
                            width: isMobile ? 38 : 50,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        {renderSortLabel('type', 'Type')}
                    </Box>
                </Grid>
                <Grid size={{ md: 6.5, xl: 6.5 }} sx={{ paddingLeft: isMobile ? 1 : 2 }}>
                    {renderSortLabel('libelle', 'Opération')}
                </Grid>
                <Grid size={{ md: 1.5, xl: 1.5 }} sx={{ textAlign: 'center' }}>
                    {renderSortLabel('date', 'Date')}
                </Grid>
                <Grid size={{ md: 2.5, xl: 2.5 }} sx={{ textAlign: 'right', paddingRight: isMobile ? 1 : 2 }}>
                    {renderSortLabel('valeur', 'Valeur')}
                </Grid>
            </Grid>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {sortedOperations.map((operation) => (
                <AnalyseOperationItem key={operation.id} operation={operation} />
            ))}
        </Box>
    </Box>
    );
};

export default AnalyseOperationsListe

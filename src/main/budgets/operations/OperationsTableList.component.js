import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import { Button, Box } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import OperationActions from './OperationActions.component';
import OperationEtat from './OperationBadgeEtat.component';
import OperationValue from './OperationSpanValue.component';
import * as DataUtils from '../../Utils/DataUtils.utils';
import * as Controller from './OperationsTableList.controller';
import CreateUpdateOperationForm from "./createupdate/CreateUpdateOperationForm.component";
import OperationMensualite from "./OperationBadgeMensualite.component";
import * as ActionController from './OperationActions.controller';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

/*
 * Liste des opérations
 */
export default class OperationsList extends Component {


    /** Etats pour Budget et opérations **/
    state = {
        idOperation: null,
        idBudget: null,
        showModale: false
    }


    /**
     * Description de la DataGrid
     * @type {GridColDef[]}
     */
    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', editable: false },
        {
            field: 'autresInfos.dateOperation',
            headerName: 'Jour opération',
            type: "date",
            editable: false, sortable: true,
            valueGetter: (params: GridValueGetterParams) => `${DataUtils.getLibelleDate(params.row.autresInfos.dateOperation, "JJ/MM/AAAA") || '-'} `,
        },
        {
            field: 'categorie',
            headerName: 'Catégorie',
            editable: false, sortable: true,
            valueGetter: (params: GridValueGetterParams) => `${params.row.categorie.libelle || '-'} `,
        },
        {
            field: 'ssCategorie',
            headerName: '',
            editable: false, sortable: true,
            valueGetter: (params: GridValueGetterParams) => `${params.row.ssCategorie.libelle || '-'} `,
        },
        {
            field: 'libelle',
            headerName: 'Description',
            editable: false, sortable: true,
        },
        {
            field: 'valeur',
            headerName: 'Valeur',
            type: "number",
            editable: false, sortable: true,
            renderCell: this.renderValue
        },
        {
            field: 'mensualite',
            headerName: 'Période',
            editable: false, sortable: true,
            renderCell: this.renderMensualite,
        },
        {
            field: 'etat',
            headerName: 'Etat',
            editable: false, sortable: true,
            renderCell: this.renderEtat,
        },
        {
            // Hack pour transmettre l'id budget au renderAction
            field: "actions",
            headerName: 'Actions',
            editable: false, sortable: true,
            renderCell: this.renderActions,
            type: "actions"
        },
        {
            field: 'autresInfos.dateMaj',
            headerName: 'Mise à jour',
            type: "string",
            editable: false, sortable: true,
            valueGetter: (params: GridValueGetterParams) => `${DataUtils.getLibelleDate(params.row.autresInfos.dateMaj, "JJ/MM/AAAA") || '-'} `,
        },
    ];



    constructor(props){
        super(props);
        this.state = {
            idOperation: null,
            idBudget: props.budget.id,
            showModale: false
        };
        this.handleOperationsListUpdate = Controller.handleOperationsListUpdate.bind(this);
        this.handleOperationUpdate = Controller.handleOperationUpdate.bind(this);
        this.handleOperationLast = Controller.handleOperationLast.bind(this);
        this.disableContextMenu = Controller.disableContextMenu.bind(this);
        this.callSetOperationAsLast = Controller.callSetOperationAsLast.bind(this);
        this.updateOperationTag = Controller.updateOperationTag.bind(this);
        this.hideModale = Controller.hideModale.bind(this);

        this.handleToggleClick = ActionController.handleToggleClick.bind(this);
        this.handleToggleClickSupprimer = ActionController.handleToggleClickSupprimer.bind(this);
        this.updateOperation = ActionController.updateOperation.bind(this);

    }

    renderMensualite(params: GridRenderCellParams<number>) {
        return <OperationMensualite key={params.id} id={params.id} mensualite={params.value} />;
    }
    renderEtat(params: GridRenderCellParams<number>) {
        return <OperationEtat key={params.id} id={params.id} etat={params.value} />;
    }
    renderValue(params: GridRenderCellParams<number>) {
        return <OperationValue key={params.id} id={params.id} valueOperation={params.value} />;
    }
    renderActions(params: GridRenderCellParams<number>) {
        return <OperationActions key={params.id} id={params.id}
                                 operation={params.row} />
    }


    /**
     *  RENDER
     //
     */

    render() {

        return (
            <>
                <Table striped bordered hover size="sm" variant="light">
                    <thead><tr>
                        <th scope="col">Jour opération</th>
                        <th scope="col" colSpan="2">Catégorie</th>
                        <th scope="col">Description</th>
                        <th scope="col">Valeur</th>
                        <th scope="col">Période</th>
                        <th scope="col">Etat</th>
                        <th scope="col">Actions</th>
                        <th scope="col">Mise à Jour</th></tr>
                    </thead>
                    <tbody className="tbodyOperation">
                    { this.props.budget.listeOperations.filter(T => T.etat !== "PLANIFIEE").map((operation) => (

                        <tr key={operation.id} id={operation.id} title={operation.etat}
                            onContextMenu={this.disableContextMenu} onDoubleClick={this.handleOperationUpdate} onAuxClick={this.handleOperationLast}
                            className={ "derniereOperation_" + operation.tagDerniereOperation  + " operation_" + operation.etat }>
                            <td>{ DataUtils.getLibelleDate(operation.autresInfos.dateOperation, "JJ/MM/AAAA") }</td>
                            <td>{ operation.categorie != null ? operation.categorie.libelle : "-" }</td>
                            <td>{ operation.ssCategorie != null ? operation.ssCategorie.libelle : "-" }</td>
                            <td>{ operation.libelle }</td>
                            <td><OperationValue valueOperation={operation.valeur} /></td>
                            <td><OperationMensualite key={operation.id} id={operation.id} mensualite={operation.mensualite}  /></td>
                            <td><OperationEtat key={operation.id} id={operation.id} etat={operation.etat}/></td>
                            <td>{ this.props.budget.actif && operation.etat !== "PLANIFIEE" &&
                                <OperationActions key={operation.id} id={operation.id}
                                                  operation={operation} budgetid={this.props.budget.id}
                                                  onOperationChange={this.handleOperationsListUpdate} />
                                }
                            </td>
                            <td>{ DataUtils.getLibelleDate(operation.autresInfos.dateMaj, "JJ/MM/AAAA") }</td>
                        </tr>

                    ))}
                    </tbody>
                </Table>

                <Box sx={{width: '100%' }}>
                    <DataGrid
                        initialState={{
                            columns: {
                                // Hide columns id, the other columns will remain visible
                                columnVisibilityModel: { id: false, },
                            },
                        }}
                        rows={this.props.budget.listeOperations.filter(T => T.etat !== "PLANIFIEE")}
                        columns={this.columns}
                        pageSize={20} rowsPerPageOptions={[20]}
                        disableSelectionOnClick
                        autoHeight={true}
                        onCellClick={this.handleToggleClick}
                    />
                    <Dialog open={this.state.showModale} >
                        <DialogTitle>Suppression d'une opération</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Voulez vous supprimer cette opération ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button id="SUPPRIMEE_ANNULER" onClick={this.handleToggleClickSupprimer} color="secondary" type="submit">Annuler</Button>
                            <Button id="SUPPRIMEE" color="success" onClick={this.handleToggleClickSupprimer} type="submit">Confirmer</Button>
                        </DialogActions>
                    </Dialog>
                </Box>


                { /** Fenêtre modale - Formulaire  **/ }
                { /** la gestion de l'affichage de la modale est délégué au composant supérieur **/ }
                { this.state.showModale && this.state.idOperation != null &&
                <CreateUpdateOperationForm idCompte={this.props.selectedCompte} budget={this.props.budget}
                                           showModale={this.state.showModale} modeEdition={true} idOperation={this.state.idOperation}
                                           hideModale={this.hideModale}
                                           onOperationChange={this.props.onOperationChange}/> }
                { /** OnOpChange est appelé par le  composant . this.props.OnOpChange : appelle la méthode du composant supérieur**/ }

            </>
        ); }
}
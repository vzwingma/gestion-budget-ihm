import React, {Component} from "react";
import {
    Button,
    ButtonGroup,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip
} from '@mui/material';
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid';

import OperationActions from './renderers/OperationActions.component';
import OperationEtat from './renderers/OperationBadgeEtat.component';
import OperationValue from './renderers/OperationSpanValue.component';
import OperationDescription from './renderers/OperationDescription.component';
import * as DataUtils from '../../Utils/DataUtils.utils';
import * as Controller from './OperationsTableList.controller';
import * as Service from './OperationsTableList.extservices';
import CreateUpdateOperationForm from "./createupdate/CreateUpdateOperationForm.component";
import OperationMensualite from "./renderers/OperationBadgeMensualite.component";
import * as ActionController from './OperationItem.controller';


/**
 * Liste des opérations
 */
export default class OperationsList extends Component {


    /** Etats pour Budget et opérations **/
    state = {
        idOperation: null,
        idBudget: null,
        showModale: false,
        showModaleEdit: false
    }


    /**
     * Description de la DataGrid
     * @type {GridColDef[]}
     */
    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', editable: false },
        {
            field: 'autresInfos.dateOperation',
            headerName: 'Jour opé.',
            type: 'string',
            editable: false, sortable: true,
            sortComparator: Controller.sorterDate,
            valueGetter: (params: GridValueGetterParams) => `${DataUtils.getRenderLibelleDate(params.row.autresInfos.dateOperation) || '-'} `,
        },
        {
            field: 'categorie',
            headerName: 'Catégorie',
            minWidth:140,
            editable: false, sortable: true,
            sortComparator: Controller.sorterCategorie,
            renderCell: this.renderCategorie
        },
        {
            field: 'ssCategorie',
            headerName: '',
            editable: false, sortable: true,
            minWidth:140,
            sortComparator: Controller.sorterCategorie,
            renderCell: this.renderSsCategorie
        },
        {
            field: 'libelle',
            headerName: 'Description',
            minWidth:330,
            editable: false, sortable: true,
            renderCell: this.renderDescription
        },
        {
            field: 'valeur',
            headerName: 'Valeur',
            type: 'number',
            editable: false, sortable: true,
            renderCell: this.renderValue
        },
        {
            field: 'mensualite',
            headerName: 'Période',
            editable: false, sortable: true,
            renderCell: this.renderMensualite,
            sortComparator: Controller.sorterMensualite,
        },
        {
            field: 'etat',
            headerName: 'Etat',
            editable: false, sortable: true,
            renderCell: this.renderEtat,
        },
        {
            field: 'actions',
            headerName: 'Actions' ,
            editable: false, sortable: false ,
            renderCell: this.renderActions,
            type: 'actions'
        },
        {
            field: 'autresInfos.dateMaj',
            headerName: 'Mise à jour',
            type: 'string',
            editable: false, sortable: true,
            sortComparator: Controller.sorterDate,
            valueGetter: (params: GridValueGetterParams) => `${DataUtils.getRenderLibelleDate(params.row.autresInfos.dateMaj) || '-'} `,
        },
    ];




    constructor(props){
        super(props);

        this.state = {
            idOperation: null,
            idBudget: props.budget.id,
            showModale: false,
            showModaleEdit: false
        };
        this.handleOperationCreate = Controller.handleOperationCreate.bind(this);
        this.handleOperationUpdate = Controller.handleOperationUpdate.bind(this);

        this.handleOperationLast = Controller.handleOperationLast.bind(this);
        this.callSetOperationAsLast = Service.callSetOperationAsLast.bind(this);
        this.updateOperationTag = Controller.updateOperationTag.bind(this);
        this.hideModale = Controller.hideModale.bind(this);

        this.handleToggleClick = ActionController.handleToggleClick.bind(this);
        this.handleOperationSelect = Controller.handleOperationSelect.bind(this);
        this.handleToggleClickSupprimer = ActionController.handleToggleClickSupprimer.bind(this);
        this.updateOperation = ActionController.updateOperation.bind(this);
    }

    renderCategorie(params: GridRenderCellParams<number>) {
        return <OperationDescription key={params.id} id={params.id} operation={params.row} libelle={(params.row.categorie !== null ? params.row.categorie.libelle : '-')} />;
    }
    renderSsCategorie(params: GridRenderCellParams<number>) {
        return <OperationDescription key={params.id} id={params.id} operation={params.row} libelle={(params.row.ssCategorie !== null ? params.row.ssCategorie.libelle : '-') } />;
    }
    renderDescription(params: GridRenderCellParams<number>) {
        return <OperationDescription key={params.id} id={params.id} operation={params.row} libelle={params.row.libelle} />;
    }
    renderMensualite(params: GridRenderCellParams<number>) {
        return <OperationMensualite key={params.id} id={params.id} mensualite={params.value} />;
    }
    renderEtat(params: GridRenderCellParams<number>) {
        return <OperationEtat key={params.id} id={params.id} etat={params.value} derniere={params.row.tagDerniereOperation} />;
    }
    renderValue(params: GridRenderCellParams<number>) {
        return <OperationValue key={params.id} id={params.id} operation={params.row} valueOperation={params.value} />;
    }
    renderActions(params: GridRenderCellParams<number>) {
        return  <OperationActions key={params.id} id={params.id} operation={params.row} />
    }


    /**
     * Si changement de budget, raz de l'idOperation
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (this.props.budget !== prevProps.budget) {
            this.setState({idOperation : null })
        }
    }

    /**
     *  RENDER
     */

    render() {

        return (
            <>

                <Container maxWidth="xl">

                    <DataGrid
                        initialState={{
                            columns: {
                                // Hide columns id, the other columns will remain visible
                                columnVisibilityModel: { id: false } ,
                            },
                            sorting: {
                                sortModel: [{ field: 'autresInfos.dateOperation', sort: 'desc' }],
                            },
                            pagination: { paginationModel: { pageSize: 18 } },
                        }}
                        columnVisibilityModel={{
                            id: false,
                            actions: (this.props.budget.actif)
                        }}
                        rows={this.props.budget.listeOperations.filter(T => T.etat !== "PLANIFIEE")}
                        columns={this.columns}
                        pageSizeOptions={[ 100 ]}
                        autoHeight={true} density={"compact"}
                        disableSelectionOnClick={!this.props.budget.actif}
                        disableColumnMenu={true}
                        hideFooterSelectedRowCount={true}
                        onCellClick={this.handleToggleClick} onRowDoubleClick={this.handleOperationLast} onRowClick={this.handleOperationSelect}
                    />
                    { this.props.budget.actif &&
                        <ButtonGroup className="bgButtonsCreateUpdateOps" variant={"light"}>
                            <Tooltip title="Créer une nouvelle opération">
                                <Button onClick={this.handleOperationCreate} color={"success"}>
                                    <img id="CREATION" src={"/img/statuts/circle_plus.png"} className="d-inline-block align-top" alt="Création"/>
                                </Button>
                            </Tooltip>
                            <Tooltip title="Editer l'opération sélectionnée">
                                <div>
                                <Button onClick={this.handleOperationUpdate} disabled={this.state.idOperation === null}>
                                    <img id="EDITION" src={"/img/statuts/circle_pen" +(this.state.idOperation === null ? "_disabled" : "")+ ".png"} className="d-inline-block align-top" alt="Création"/>
                                </Button>
                                </div>
                            </Tooltip>
                        </ButtonGroup>
                    }
                </Container>

                { /* Fenêtre modale de suppression */ }
                <Dialog open={this.state.showModale} >
                    <DialogTitle>Suppression d'une opération</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">Voulez vous supprimer cette opération ?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <ButtonGroup>
                            <Button id="SUPPRIMEE_ANNULER" onClick={this.handleToggleClickSupprimer} color="error" type="submit">Annuler</Button>
                            <Button id="SUPPRIMEE" color="success" onClick={this.handleToggleClickSupprimer} type="submit">Confirmer</Button>
                        </ButtonGroup>
                    </DialogActions>
                </Dialog>

                { /** Fenêtre modale - Formulaire  **/ }
                { /** la gestion de l'affichage de la modale est délégué au composant supérieur **/ }
                { this.state.showModaleEdit &&
                    <CreateUpdateOperationForm idCompte={this.props.selectedCompte} budget={this.props.budget}
                                               showModale={this.state.showModaleEdit}
                                               modeEdition={this.state.idOperation !== null}
                                               idOperation={this.state.idOperation}
                                               hideModale={this.hideModale}
                                               onOperationChange={this.props.onOperationChange}/>
                }
                { /** OnOpChange est appelé par le  composant . this.props.OnOpChange : appelle la méthode du composant supérieur**/ }
            </>
        ); }
}

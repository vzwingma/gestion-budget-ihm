import React, { useState } from "react";
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { handleModalClick, handleSelect } from "./DateRange.controller";


/**
 * Props du composant
 */
interface DateRangeProps {
    selectedDate: Date;
    onDateChange: Function
}

/**
 * Date Range Select
 * @param selectedDate : date date sélectionnée
 * @param onDateChange : function sélection d'une date
 */

const DateRange: React.FC<DateRangeProps> = ({ selectedDate, onDateChange: handleDateChange }: DateRangeProps): JSX.Element => {


    // Init des états
    const [showModale, setShowModale] = useState(false);
    const [datePreviousBudget, setDatePreviousBudget] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1, 0, 0, 0));
    const [dateCurrentBudget, setDateCurrentBudget] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0));
    const [dateNextBudget, setDateNextBudget] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1, 0, 0, 0));

    /**
     *  Mise à jour du contexte de budget
     * @param nextProps next properties
     * @param nextStates next states
     * @param nextContext next Context
     * @returns {boolean} s'il faut refresh ou pas

    shouldComponentUpdate(nextProps, nextStates, nextContext) {
        if (dateCurrentBudget.getTime() !== nextStates.dateCurrentBudget.getTime()) {
            return true;
        } else if (showModale !== nextStates.showModale) {
            return true
        }
        return false;
    }
     */
    /**
     * Mise à jour des dates
     * @param newDatePreviousBudget date précédente
     * @param newDateCurrentBudget date courante
     * @param newDateNextBudget date suivante
     */
    function updateMonths(newDatePreviousBudget: Date, newDateCurrentBudget: Date, newDateNextBudget: Date) {

        setDatePreviousBudget(newDatePreviousBudget);
        setDateCurrentBudget(newDateCurrentBudget);
        setDateNextBudget(newDateNextBudget);
        // Date sélectionnée, remonté à budget
        handleDateChange(newDateCurrentBudget);
    }

    /**
     *  RENDER
     */

    return (
        <div style={{ textAlign: 'center' }}>
            <ButtonGroup onClick={e => handleSelect(e, datePreviousBudget, dateCurrentBudget, dateNextBudget, setShowModale, updateMonths)}>
                <Button id="previous"
                    size={"small"}>{datePreviousBudget.toLocaleString('default', { month: 'long' })} {datePreviousBudget.getFullYear()}  </Button>
                <Button id="current"
                    variant={"contained"}>{dateCurrentBudget.toLocaleString('default', { month: 'long' })} {dateCurrentBudget.getFullYear()}</Button>
                <Button id="next"
                    size={"small"}>{dateNextBudget.toLocaleString('default', { month: 'long' })} {dateNextBudget.getFullYear()}</Button>
            </ButtonGroup>


            { /* Fenêtre modale de suppression */}
            <Dialog open={showModale}>
                <DialogTitle>Confirmation d'ouverture</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description"><p>L'ouverture d'un nouveau mois, va clôturer
                        le mois courant, et reporter toutes les opérations non réalisées</p><p>Voulez vous continuer
                            ? </p></DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ButtonGroup>
                        <Button id="ANNULER" onClick={e => {
                            handleModalClick(e, dateCurrentBudget, dateNextBudget, updateMonths);
                            setShowModale(false);
                        }}
                            color="error" type="submit">Annuler</Button>

                        <Button id="CONFIRMER" color="success" onClick={e => {
                            handleModalClick(e, dateCurrentBudget, dateNextBudget, updateMonths);
                            setShowModale(false);
                        }}
                            type="submit">Confirmer</Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default DateRange

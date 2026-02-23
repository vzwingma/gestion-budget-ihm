import React, { useState, useEffect } from 'react';
import {

    Stack,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    ButtonGroup,
    Typography,
    Box,
    TextField
} from '@mui/material';
import { AnalysesPeriodeModel } from '../../../Models/analyses/AnalysesPeriode.model.ts';
import { AnalysesFiltrePeriodeProps } from '../../Components.props.ts';
import { getValidPeriodesForCompte } from '../Analyses.extservices.ts';



/**
 * Composant pour le filtre de période dans les analyses.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {AnalysesPeriodeModel} props.periode - La période actuelle.
 * @param {CompteBancaireModel | null} props.selectedCompte - Le compte sélectionné.
 * @param {Function} props.onChange - Fonction appelée lorsque la période change.
 * @returns {JSX.Element} Le composant du filtre de période.
 */
export const AnalysesFiltrePeriodeComponent: React.FC<AnalysesFiltrePeriodeProps> = ({ periode, selectedCompte, onChange }) => {
    const [vuePeriode, setVuePeriode] = useState<boolean>(periode.vuePeriode);
    const [dateDebut, setDateDebut] = useState<Date | null>(periode.periodeDebut || new Date());
    const [dateFin, setDateFin] = useState<Date | null>(periode.periodeFin || new Date());
    const [dateMinBudget, setDateMinBudget] = useState<Date | null>(null);
    const [dateMaxBudget, setDateMaxBudget] = useState<Date | null>(null);

    const aujourdhui = new Date();
    const moisCourant = aujourdhui.getMonth();
    const anneeCourante = aujourdhui.getFullYear();
    const formatMonth = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const todayMonth = formatMonth(aujourdhui);
    const minBudgetMonth = dateMinBudget ? formatMonth(dateMinBudget) : undefined;
    const maxBudgetMonth = dateMaxBudget ? formatMonth(dateMaxBudget) : todayMonth;


    /** Calcule la durée de la période en mois */
    const calculerDuree = (): number => {
        if (vuePeriode) {
            if (dateDebut && dateFin) {
                const diffMois = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12 +
                    (dateFin.getMonth() - dateDebut.getMonth()) + 1;
                return Math.max(1, diffMois);
            }
        } else {
            return 1;
        }
        return 0;
    };

    /** Applique un raccourci de période 
     * @param moisRecul nombre de mois à reculer pour le raccourci
     * @param typeRaccourci type de raccourci (optionnel) : 'annee-courante' ou 'annee-precedente'
     */
    const appliquerRaccourci = (moisRecul: number, typeRaccourci?: 'annee-courante' | 'annee-precedente') => {
        setVuePeriode(true);
        let debut: Date;
        let fin: Date = new Date(anneeCourante, moisCourant, 1);

        if (typeRaccourci === 'annee-courante') {
            debut = new Date(anneeCourante, 0, 1);
        } else if (typeRaccourci === 'annee-precedente') {
            debut = new Date(anneeCourante - 1, 0, 1);
            fin = new Date(anneeCourante - 1, 11, 1);
        } else {
            debut = new Date(anneeCourante, moisCourant - moisRecul + 1, 1);
        }

        if (dateMinBudget && debut < dateMinBudget) {
            debut = new Date(dateMinBudget);
        }

        if (dateMaxBudget && fin > dateMaxBudget) {
            fin = new Date(dateMaxBudget);
        }

        if (debut > fin) {
            if (dateMinBudget && dateMaxBudget) {
                debut = new Date(dateMinBudget);
                fin = new Date(dateMaxBudget);
            } else {
                debut = new Date(fin);
            }
        }

        setDateDebut(debut);
        setDateFin(fin);
    };

    /** Effet pour notifier le parent du changement de période */
    useEffect(() => {
        let periodeDebutNormalisee = (dateDebut || new Date());
        let periodeFinNormalisee = (dateFin || new Date());

        if (vuePeriode && dateDebut && dateFin) {
            const diffMois = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12 +
                (dateFin.getMonth() - dateDebut.getMonth()) + 1;

            if (diffMois > 12) {
                periodeDebutNormalisee = new Date(dateFin.getFullYear(), dateFin.getMonth() - 11, 1);

                if (dateDebut.getTime() !== periodeDebutNormalisee.getTime()) {
                    setDateDebut(periodeDebutNormalisee);
                }
            }
        }

        const nouvellePeriode: AnalysesPeriodeModel = {
            vuePeriode: vuePeriode,
            periodeDebut: periodeDebutNormalisee,
            periodeFin: periodeFinNormalisee
        };
        onChange(nouvellePeriode);
    }, [vuePeriode, dateDebut, dateFin, onChange]);


    /** Effet pour charger les intervalles de budget valides lorsque le compte sélectionné change */
    useEffect(() => {
        if (selectedCompte) {
            getValidPeriodesForCompte(selectedCompte)
                .then(intervallesBudget => {
                    console.log("Périodes d'analyses valides pour le compte " + selectedCompte?.libelle, intervallesBudget);

                    if (intervallesBudget && intervallesBudget.length > 0) {
                        setDateMinBudget(intervallesBudget[0].debut);
                        setDateMaxBudget(intervallesBudget[0].fin);
                    } else {
                        setDateMinBudget(null);
                        setDateMaxBudget(null);
                    }
                })
        } else {
            setDateMinBudget(null);
            setDateMaxBudget(null);
        }
    }, [selectedCompte]);


    return (
        <Stack direction="column" spacing={2} paddingLeft={2}>
            <FormControl>
                <RadioGroup row value={vuePeriode} onChange={(e) => setVuePeriode(e.target.value === 'true')}>
                    <FormControlLabel value="false" control={<Radio />} label="Mois" />
                    <FormControlLabel value="true" control={<Radio />} label="Période" />
                </RadioGroup>
            </FormControl>

            {!vuePeriode && (
                <TextField
                    label="Mois" type="month"
                    variant='standard' size={'small'}
                    value={dateFin ? formatMonth(dateFin) : todayMonth}
                    onChange={(e) => {
                        const [year, month] = e.target.value.split('-');
                        setDateDebut(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1));
                        setDateFin(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1));
                    }}
                    slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: {
                            min: minBudgetMonth,
                            max: maxBudgetMonth
                        }
                    }}
                />
            )}

            {vuePeriode && (
                <>
                    <Stack direction="row" spacing={5}>
                        <TextField
                            label="Début" type="month"
                            variant='standard' size={'small'}
                            sx={{ minWidth: '45%' }}
                            value={dateDebut ? formatMonth(dateDebut) : ''}
                            onChange={(e) => {
                                const [year, month] = e.target.value.split('-');
                                setDateDebut(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1));
                            }}
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: {
                                    min: minBudgetMonth,
                                    max: dateFin ? formatMonth(dateFin) : maxBudgetMonth
                                }
                            }}
                        />
                        <TextField
                            label="Fin" type="month"
                            variant='standard' size={'small'}
                            sx={{ minWidth: '45%' }}
                            value={dateFin ? formatMonth(dateFin) : ''}
                            onChange={(e) => {
                                const [year, month] = e.target.value.split('-');
                                setDateFin(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1));
                            }}
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: {
                                    min: dateDebut ? formatMonth(dateDebut) : minBudgetMonth,
                                    max: maxBudgetMonth
                                }
                            }}
                        />
                    </Stack>

                    <Box>
                        <Typography variant="body2">
                            Durée : {calculerDuree()} mois
                        </Typography>
                    </Box>

                    <ButtonGroup variant="outlined" size="small">
                        <Button onClick={() => appliquerRaccourci(3)}>3 mois</Button>
                        <Button onClick={() => appliquerRaccourci(6)}>6 mois</Button>
                        <Button onClick={() => appliquerRaccourci(12)}>12 mois</Button>
                        <Button onClick={() => appliquerRaccourci(0, 'annee-courante')}>Année courante</Button>
                        <Button onClick={() => appliquerRaccourci(0, 'annee-precedente')}>Année précédente</Button>
                    </ButtonGroup>

                    <Typography variant="caption" color="text.secondary">
                        12 mois maximum
                    </Typography>
                </>
            )}
        </Stack>
    );
};
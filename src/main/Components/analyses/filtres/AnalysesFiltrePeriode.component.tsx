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




export const AnalysesFiltrePeriodeComponent: React.FC<AnalysesFiltrePeriodeProps> = ({ periode, onChange }) => {
    const [vuePeriode, setVuePeriode] = useState<boolean>(periode.vuePeriode);
    const [moisSelectionne, setMoisSelectionne] = useState<number>(periode.periodeDebut.getMonth() || new Date().getMonth());
    const [anneeSelectionnee, setAnneeSelectionnee] = useState<number>(periode.periodeDebut.getFullYear() || new Date().getFullYear());
    const [dateDebut, setDateDebut] = useState<Date | null>(periode.periodeDebut || new Date());
    const [dateFin, setDateFin] = useState<Date | null>(periode.periodeFin || new Date());

    const aujourdhui = new Date();
    const moisCourant = aujourdhui.getMonth();
    const anneeCourante = aujourdhui.getFullYear();

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

        setDateDebut(debut);
        setDateFin(fin);
    };

    useEffect(() => {
        const nouvellePeriode: AnalysesPeriodeModel = {
            vuePeriode: vuePeriode,
            periodeDebut: vuePeriode ? (dateDebut || new Date()) : new Date(anneeSelectionnee, moisSelectionne, 1),
            periodeFin: vuePeriode ? (dateFin || new Date()) : new Date(anneeSelectionnee, moisSelectionne, 1)
        };
        onChange(nouvellePeriode);
    }, [vuePeriode, moisSelectionne, anneeSelectionnee, dateDebut, dateFin, onChange]);

    return (
        <Stack direction="column" spacing={2}>
            <FormControl>
                <RadioGroup row value={vuePeriode} onChange={(e) => setVuePeriode(e.target.value === 'true')}>
                    <FormControlLabel value="false" control={<Radio />} label="Mois" />
                    <FormControlLabel value="true" control={<Radio />} label="Période" />
                </RadioGroup>
            </FormControl>

            {!vuePeriode && (
                <TextField
                    label="Mois"
                    type="month"
                    value={`${anneeSelectionnee}-${String(moisSelectionne + 1).padStart(2, '0')}`}
                    onChange={(e) => {
                        const [year, month] = e.target.value.split('-');
                        setAnneeSelectionnee(Number.parseInt(year));
                        setMoisSelectionne(Number.parseInt(month) - 1);
                    }}
                    slotProps={{ 
                        inputLabel: { shrink: true },
                        htmlInput: {
                            max: `${aujourdhui.getFullYear()}-${String(aujourdhui.getMonth() + 1).padStart(2, '0')}`
                        }
                    }}
                />
            )}

            {vuePeriode && (

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Début"
                        type="month"
                        value={dateDebut ? `${dateDebut.getFullYear()}-${String(dateDebut.getMonth() + 1).padStart(2, '0')}` : ''}
                        onChange={(e) => {
                            const [year, month] = e.target.value.split('-');
                            setDateDebut(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1));
                        }}
                        slotProps={{ 
                            inputLabel: { shrink: true },
                            htmlInput: {
                                max: dateFin ? `${dateFin.getFullYear()}-${String(dateFin.getMonth() + 1).padStart(2, '0')}` : `${aujourdhui.getFullYear()}-${String(aujourdhui.getMonth() + 1).padStart(2, '0')}`
                            }
                        }}
                    />
                    <TextField
                        label="Fin"
                        type="month"
                        value={dateFin ? `${dateFin.getFullYear()}-${String(dateFin.getMonth() + 1).padStart(2, '0')}` : ''}
                        onChange={(e) => {
                            const [year, month] = e.target.value.split('-');
                            setDateFin(new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1));
                        }}
                        slotProps={{ 
                            inputLabel: { shrink: true },
                            htmlInput: {
                                min: dateDebut ? `${dateDebut.getFullYear()}-${String(dateDebut.getMonth() + 1).padStart(2, '0')}` : undefined,
                                max: `${aujourdhui.getFullYear()}-${String(aujourdhui.getMonth() + 1).padStart(2, '0')}`
                            }
                        }}
                    />
                </Stack>
            )}

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
        </Stack>
    );
};
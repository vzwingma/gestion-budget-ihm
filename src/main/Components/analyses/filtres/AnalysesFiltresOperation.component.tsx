import React, { JSX } from "react";
import { Checkbox, FormControlLabel, Grid, Stack, Typography } from "@mui/material";
import { OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM } from "../../../Utils/AppBusinessEnums.constants.ts";
import { AnalysesFiltresOperationProps } from "../../Components.props.ts";

/**
 * Composant pour filtrer les opérations par état et par type.
 * @component
 * @property {OPERATION_ETATS_ENUM[]} selectedEtats - Liste des états sélectionnés
 * @property {TYPES_OPERATION_ENUM[]} selectedTypes - Liste des types sélectionnés
 * @property {(selectedEtats: OPERATION_ETATS_ENUM[], selectedTypes: TYPES_OPERATION_ENUM[]) => void} onChange - Callback lors d'une sélection
 * @returns {JSX.Element} Élément JSX représentant le composant
 */
export const AnalysesFiltresOperation: React.FC<AnalysesFiltresOperationProps> = ({
	selectedEtats,
	selectedTypes,
	onChange
}: AnalysesFiltresOperationProps): JSX.Element => {

	const toggleEtat = (etat: OPERATION_ETATS_ENUM) => {
		const newEtats = selectedEtats.includes(etat)
			? selectedEtats.filter((e) => e !== etat)
			: [...selectedEtats, etat];

		onChange(newEtats, selectedTypes);
	};

	const toggleType = (type: TYPES_OPERATION_ENUM) => {
		const newTypes = selectedTypes.includes(type)
			? selectedTypes.filter((t) => t !== type)
			: [...selectedTypes, type];

		onChange(selectedEtats, newTypes);
	};

	return (
		<Stack direction={"column"} spacing={1} alignItems={"flex-start"}>

			<Grid container width={"90%"} columnSpacing={2} rowSpacing={1} alignItems={"center"}>
				<Grid size={{ md: 4, xl: 4 }}>
					<Typography variant={"subtitle2"} sx={{ color: 'var(--color-operations-secondary)' }}>État</Typography>
				</Grid>
				<Grid size={{ md: 4, xl: 4 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={selectedEtats.includes(OPERATION_ETATS_ENUM.PREVUE)}
								onChange={() => toggleEtat(OPERATION_ETATS_ENUM.PREVUE)}
								size="small"
							/>
						}
						label={"Prévue"}
					/>
				</Grid>
				<Grid size={{ md: 4, xl: 4 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={selectedEtats.includes(OPERATION_ETATS_ENUM.REALISEE)}
								onChange={() => toggleEtat(OPERATION_ETATS_ENUM.REALISEE)}
								size="small"
							/>
						}
						label={"Réalisée"}
					/>
				</Grid>
				<Grid size={{ md: 4, xl: 4 }}>
					<Typography>Type</Typography>
				</Grid>
				<Grid size={{ md: 4, xl: 4 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={selectedTypes.includes(TYPES_OPERATION_ENUM.DEPENSE)}
								onChange={() => toggleType(TYPES_OPERATION_ENUM.DEPENSE)}
								size="small"
							/>
						}
						label={"Dépense"}
					/>
				</Grid>
				<Grid size={{ md: 4, xl: 4 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={selectedTypes.includes(TYPES_OPERATION_ENUM.CREDIT)}
								onChange={() => toggleType(TYPES_OPERATION_ENUM.CREDIT)}
								size="small"
							/>
						}
						label={"Crédit"}
					/>
				</Grid>
			</Grid>
		</Stack>
	);
};

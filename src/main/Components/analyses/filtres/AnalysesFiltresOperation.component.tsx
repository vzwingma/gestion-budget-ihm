import React, { JSX } from "react";
import { Box, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
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
			<Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
				<Typography variant={"subtitle2"}>État</Typography>
				<FormControlLabel
					control={
						<Checkbox
							checked={selectedEtats.includes(OPERATION_ETATS_ENUM.PREVUE)}
							onChange={() => toggleEtat(OPERATION_ETATS_ENUM.PREVUE)}
						/>
					}
					label={"Prévue"}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={selectedEtats.includes(OPERATION_ETATS_ENUM.REALISEE)}
							onChange={() => toggleEtat(OPERATION_ETATS_ENUM.REALISEE)}
						/>
					}
					label={"Réalisée"}
				/>

			</Box>

			<Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
				<Typography variant={"subtitle2"}>Type</Typography>

				<FormControlLabel
					control={
						<Checkbox
							checked={selectedTypes.includes(TYPES_OPERATION_ENUM.DEPENSE)}
							onChange={() => toggleType(TYPES_OPERATION_ENUM.DEPENSE)}
						/>
					}
					label={"Dépense"}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={selectedTypes.includes(TYPES_OPERATION_ENUM.CREDIT)}
							onChange={() => toggleType(TYPES_OPERATION_ENUM.CREDIT)}
						/>
					}
					label={"Crédit"}
				/>                
			</Box>
		</Stack>
	);
};

import React, { JSX, useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { TYPES_CATEGORIES_OPERATION_ENUM } from "../../../Utils/AppBusinessEnums.constants.ts";
import { getTypeCategorieRenderer } from "../../../Utils/renderers/OperationItem.renderer.tsx";
import { AnalyseSyntheseTypesProps } from "../../Components.props.ts";

/**
 * Composant de synthèse des types de catégories d'opérations.
 * Affiche une BarChart horizontale empilée à 100% et une légende associée.
 *
 * @component
 * @property {OperationModel[]} operations - Liste des opérations
 * @property {TYPES_CATEGORIES_OPERATION_ENUM[]} selectedTypes - Types sélectionnés
 * @returns {JSX.Element} Élément JSX représentant le composant
 */
export const AnalyseSyntheseTypes: React.FC<AnalyseSyntheseTypesProps> = ({
	operations,
	selectedTypes
}: AnalyseSyntheseTypesProps): JSX.Element => {

	const { chartData, legendItems } = useMemo(() => {
		const totalsByType = new Map<TYPES_CATEGORIES_OPERATION_ENUM, number>();
		selectedTypes.forEach((type) => totalsByType.set(type, 0));

		operations.forEach((operation) => {
			const type = operation?.ssCategorie?.type;
			if (!type || !totalsByType.has(type)) {
				return;
			}
			const current = totalsByType.get(type) ?? 0;
			totalsByType.set(type, current + Math.abs(operation.valeur ?? 0));
		});

		const totalAll = Array.from(totalsByType.values()).reduce((acc, v) => acc + v, 0);

		const seriesData = selectedTypes.map((type) => {
			const renderer = getTypeCategorieRenderer(type);
			const value = totalsByType.get(type) ?? 0;
			const percent = totalAll > 0 ? (value / totalAll) * 100 : 0;

			return {
				type,
				label: renderer.text,
				color: renderer.color,
				percent
			};
		});

		const chartRow: Record<string, number | string> = { name: "" };
		seriesData.forEach((item) => {
			chartRow[item.type] = Number(item.percent.toFixed(2));
		});

		return {
			chartData: [chartRow],
			legendItems: seriesData
		};
	}, [operations, selectedTypes]);

	return (
		<Stack direction="column" spacing={2} sx={{ width: "100%" }}>
			<Box sx={{ width: "100%", height: 80 }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						layout="vertical"
						data={chartData}
						margin={{ left: 20, right: 20, top: 5, bottom: 10 }}>
						<XAxis
							type="number"
							domain={[0, 100]}
							tick={false}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis type="category" dataKey="name" width={0} />
						{legendItems.map((item) => (
							<Bar
								key={item.type}
								dataKey={item.type}
								stackId="total"
								fill={item.color}
								isAnimationActive={true}
							/>
						))}
					</BarChart>
				</ResponsiveContainer>

			<Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ marginTop : -4, paddingLeft: 3 }}>
				{legendItems.map((item) => (
					<Box key={item.type} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: item.color }} />
						<Typography variant="caption" sx={{ color: item.color }}>
							{item.label}: {item.percent.toFixed(1)}%
						</Typography>
					</Box>
				))}
			</Stack>
			</Box>

		</Stack>
	);
};

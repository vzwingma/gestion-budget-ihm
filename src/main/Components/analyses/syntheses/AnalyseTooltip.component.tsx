import React, { JSX, ReactNode } from "react";
import { Box, Divider, Typography } from "@mui/material";

/**
 * Une ligne de données affichée dans le tooltip (AP 006 - T3).
 */
export interface AnalyseTooltipRow {
    key: string;
    label: ReactNode;
    value: ReactNode;
    /** Couleur de la pastille + du libellé (ex: couleur de série du graphique) **/
    color?: string;
}

interface AnalyseTooltipProps {
    active?: boolean;
    title?: ReactNode;
    rows: AnalyseTooltipRow[];
    minWidth?: string;
    /**
     * `stacked` (défaut) : titre + liste de lignes empilées (AnalyseEvolutionTooltip, AnalyseTreeMapTooltip).
     * `inline` : une seule ligne libellé/valeur sur une même ligne (AnalyseSyntheseTooltip).
     */
    variant?: 'stacked' | 'inline';
}

const containerSx = {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    color: 'white',
    padding: 2,
    borderRadius: 1,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
};

/**
 * Tooltip générique recharts (AP 006 - T3), factorisant la structure commune auparavant
 * dupliquée entre `AnalyseEvolutionTooltip`, `AnalyseSyntheseTooltip` et `AnalyseTreeMapTooltip` :
 * garde `active`/données vides, style du conteneur, titre + séparateur, lignes libellé/valeur.
 *
 * Chaque tooltip spécifique ne garde que son propre formatage (calcul des lignes, couleurs,
 * libellés métier) et délègue le rendu à ce composant.
 */
const AnalyseTooltip: React.FC<AnalyseTooltipProps> = ({
    active,
    title,
    rows,
    minWidth,
    variant = 'stacked'
}: AnalyseTooltipProps): JSX.Element => {

    if (!active || rows.length === 0) {
        return <></>;
    }

    if (variant === 'inline') {
        const row = rows[0];
        return (
            <Box sx={{ ...containerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: row.color }}>
                    {row.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                    {row.value}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ ...containerSx, minWidth }}>
            {title != null &&
                <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, marginBottom: 1, color: 'white' }}>
                        {title}
                    </Typography>
                    <Divider sx={{ marginBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                </>
            }
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {rows.map((row) => (
                    <Box key={row.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {row.color != null &&
                                <Box sx={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: row.color, flexShrink: 0 }} />
                            }
                            <Typography variant="body2" sx={{ color: row.color ?? 'inherit' }}>
                                {row.label}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'white', marginLeft: 2 }}>
                            {row.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AnalyseTooltip;

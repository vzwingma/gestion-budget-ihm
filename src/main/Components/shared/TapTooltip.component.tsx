import React, {JSX, ReactElement, ReactNode, useCallback, useState} from "react";
import {Box, ClickAwayListener, Tooltip, TooltipProps} from "@mui/material";
import {useIsTouchDevice} from "../../hooks/useIsTouchDevice.ts";

interface TapTooltipProps {
    /** Contenu de l'infobulle */
    title: ReactNode;
    /** Élément déclencheur (doit accepter une ref) */
    children: ReactElement;
    /** Suit le curseur (survol desktop uniquement) */
    followCursor?: boolean;
    slotProps?: TooltipProps['slotProps'];
}

/**
 * Infobulle accessible au tactile :
 * - desktop (survol) : `Tooltip` MUI inchangé ;
 * - appareil tactile sans survol : infobulle contrôlée, ouverte au tap sur le déclencheur,
 *   fermée par un second tap ou un tap ailleurs (`ClickAwayListener`).
 * Le clic n'est jamais stoppé : un handler `onClick` parent (ex. sélection de ligne) reste actif.
 */
const TapTooltip: React.FC<TapTooltipProps> = ({title, children, followCursor, slotProps}: TapTooltipProps): JSX.Element => {
    const isTouch = useIsTouchDevice();
    const [open, setOpen] = useState<boolean>(false);

    const handleToggle = useCallback(() => setOpen((previous) => !previous), []);
    const handleClose = useCallback(() => setOpen(false), []);

    if (!isTouch) {
        return <Tooltip title={title} followCursor={followCursor} slotProps={slotProps}>{children}</Tooltip>;
    }
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box component="span" onClick={handleToggle} sx={{display: "contents"}}>
                <Tooltip title={title} open={open} onClose={handleClose} slotProps={slotProps}
                         disableHoverListener disableFocusListener disableTouchListener>
                    {children}
                </Tooltip>
            </Box>
        </ClickAwayListener>
    );
};

export default TapTooltip;

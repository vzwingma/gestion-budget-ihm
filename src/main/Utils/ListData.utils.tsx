import { useMediaQuery, useTheme } from "@mui/material";
/**
 * Get the appropriate height for lists based on device type
 * @returns {number} calculated height in pixels
 */
export function getHeightList() {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    return isMobile ? window.innerHeight - 95 : window.innerHeight - 140;
}
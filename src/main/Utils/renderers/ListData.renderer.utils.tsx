/**
 * Get the appropriate height for lists based on device type
 * @returns {number} calculated height in pixels
 */
export function getHeightList(isMobile : boolean) {
    return isMobile ? window.innerHeight - 95 : window.innerHeight - 140;
}
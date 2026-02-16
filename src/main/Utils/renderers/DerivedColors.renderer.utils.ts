
/**
 * Converts hex color to HSL
 */
const hexToHSL = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    
    let r = Number.parseInt(result[1], 16) / 255;
    let g = Number.parseInt(result[2], 16) / 255;
    let b = Number.parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return [h * 360, s * 100, l * 100];
};

/**
 * Converts HSL to hex color
 */
const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Generates derived colors from a base color
 */
export const generateDerivedColors = (baseColor: string, count: number): string[] => {
    const [h, s] = hexToHSL(baseColor);
    const colors: string[] = [];
    
    // Generate variations by adjusting lightness and slightly adjusting hue
    for (let i = 0; i < count; i++) {
        const factor = count > 1 ? i / (count - 1) : 0.5;
        // Vary lightness between 30% and 70%
        const newL = 30 + factor * 40;
        // Slightly vary hue (±15 degrees)
        const newH = (h + (factor - 0.5) * 30 + 360) % 360;
        // Keep saturation or slightly adjust it
        const newS = Math.max(40, Math.min(100, s + (factor - 0.5) * 20));
        
        colors.push(hslToHex(newH, newS, newL));
    }
    
    return colors;
};
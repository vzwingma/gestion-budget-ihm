import React, { JSX } from "react";

interface AnalyseTreeMapContentProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
    color?: string;
    size?: number;
    onClick?: () => void;
    [key: string]: any;
}

/**
 * Custom content renderer for treemap cells with better text visibility
 */
const AnalyseTreeMapContent: React.FC<AnalyseTreeMapContentProps> = (props: AnalyseTreeMapContentProps): JSX.Element => {
    const { x = 0, y = 0, width = 0, height = 0, name, color, size, onClick } = props;
    // Only show text if cell is large enough
    const showText = width > 60 && height > 30;
    const fontSize = Math.min(width / 8, height / 3.5, 14);
    
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: color,
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    cursor: onClick ? 'pointer' : 'default',
                }}
                onClick={onClick}
            />
            {showText && (
                <>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - fontSize / 2}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={fontSize}
                        fontWeight="600"
                        style={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            cursor: onClick ? 'pointer' : 'default',
                            pointerEvents: 'none'
                        }}
                    >
                        {name}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + fontSize}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={fontSize * 0.85}
                        fontWeight="500"
                        style={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            cursor: onClick ? 'pointer' : 'default',
                            pointerEvents: 'none'
                        }}
                    >
                        {size?.toFixed(1) ?? '?'}%
                    </text>
                </>
            )}
        </g>
    );
};


export default AnalyseTreeMapContent;

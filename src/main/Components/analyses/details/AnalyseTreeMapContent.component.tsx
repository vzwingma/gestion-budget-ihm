import React from "react";

/**
 * Custom content renderer for treemap cells with better text visibility
 */
const AnalyseTreeMapContent = (props: any) => {
    const { x, y, width, height, name, color, size, onClick } = props;
    console.log('Rendering cell:', { name, size, x, y, width, height, color });
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

import React from 'react';

const ColorBox = ({ colors,onChange, style }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', ...style }}>
            {colors.map((color, index) => (
                <div
                    key={index}
                    onClick={() => onChange(color)}
                    style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '5px',
                        backgroundColor: color,
                        margin: '5px',
                        cursor: 'pointer'
                    }}
                ></div>
            ))}
        </div>
    );
};

export default ColorBox;

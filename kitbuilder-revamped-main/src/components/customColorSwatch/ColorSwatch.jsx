import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected } from '../../redux/userData/userdataSlice'; // Assuming the path to your Redux slice

const colors = [
    '#FF5733', '#33FF57', '#5733FF', '#FFF133', '#FF33F5', '#33FFF9',
    '#FFA07A', '#20B2AA', '#9370DB', '#FFD700', '#FF4500', '#2E8B57',
    '#8A2BE2', '#7FFF00', '#D2691E', '#FF69B4', '#4B0082', '#F0E68C',
];

const ColorSwatch = ({ selectedColor, colorType }) => {
  const dispatch = useDispatch();
  const selectedcolors = useSelector((state) => state.userdata.selectedcolors);
  console.log(selectedcolors,"selectedcolors")

  const handleColorClick = (color) => {
      if (colorType === "Primary") {
          dispatch(setSelected([color, ...selectedcolors.slice(1)]));
      } else if (colorType === "Secondary A") {
          dispatch(setSelected([selectedcolors[0], color, selectedcolors[2]]));
      } else if (colorType === "Secondary B") {
          dispatch(setSelected([...selectedcolors.slice(0, 2), color]));
      }
  };


  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {colors.map((color, index) => (
        <div
            key={index}
            style={{
                width: '25px',
                height: '25px',
                borderRadius: "5px",
                backgroundColor: color,
                margin: '5px',
                cursor: 'pointer',
                border: color === selectedColor ? '3px solid #757575' : 'none' // Add border if color is selected
            }}
            onClick={() => handleColorClick(color)}
        />
    ))}
</div>
  );
};

export default ColorSwatch;

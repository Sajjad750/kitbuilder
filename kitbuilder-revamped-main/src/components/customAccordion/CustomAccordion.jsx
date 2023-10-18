import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected } from '../../redux/userData/userdataSlice';
import { ColorPickerComponent } from '../customColorSwatch/ColorPicker';

const CustomAccordion = ({ heading, isExpanded, onChange, colorType }) => {
    const selectedcolors = useSelector((state) => state.userdata.selectedcolors);
    const [currentColor, setCurrentColor] = useState('#fff'); // Local state for color picker
    const dispatch = useDispatch();

    let selectedColor;
    if (colorType === "Primary") selectedColor = selectedcolors[0];
    else if (colorType === "Secondary A") selectedColor = selectedcolors[1];
    else if (colorType === "Secondary B") selectedColor = selectedcolors[2];

    useEffect(() => {
        dispatch(setSelected([]));
    }, [dispatch]);

    const handleColorChange = (color) => {
        setCurrentColor(color); // Update local state

        // Update Redux store based on colorType
        if (colorType === "Primary") {
            dispatch(setSelected([color, ...selectedcolors.slice(1)]));
        } else if (colorType === "Secondary A") {
            dispatch(setSelected([selectedcolors[0], color, selectedcolors[2]]));
        } else if (colorType === "Secondary B") {
            dispatch(setSelected([...selectedcolors.slice(0, 2), color]));
        }
    };

    // console.log(selectedcolors,"selectedcolors")
    return (
        <div style={{ width: '100%', margin: '5px auto' }}>
            <Accordion sx={{ mt: 2 }} expanded={isExpanded} onChange={onChange}>
                <AccordionSummary
                    expandIcon={isExpanded ? <RemoveIcon /> : <AddIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ color: "#545454" }} className='nunito-b'>{heading}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ overflowY: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography>
                        <ColorPickerComponent color={currentColor} onChange={handleColorChange} />
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default CustomAccordion;

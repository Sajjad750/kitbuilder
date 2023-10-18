import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ColorPickerComponent } from '../customColorSwatch/ColorPicker'; // Import the ColorPickerComponent

const PathAccordion = ({ summary, changeLayerColor }) => {
    const [SideColor, setSideColor] = useState('');
    const [isExpanded, setIsExpanded] = useState(false); // State to handle accordion expansion

    const handleColorChange = (color) => {
        changeLayerColor(color, summary);
        setSideColor(color);
    };

    return (
        <div style={{ width: '100%', margin: '5px auto' }}>
            <Accordion sx={{ mt: 2 }} expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)}>
                <AccordionSummary
                    expandIcon={isExpanded ? <RemoveIcon /> : <AddIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography  sx={{ 
                            color: "#545454", 
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '90%',
                            display: 'inline-block'
                        }}  className='nunito-b'> {summary.length > 20 ? `${summary.substring(0, 25)}...` : summary}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ overflowY: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography>
                        <ColorPickerComponent color={SideColor} onChange={handleColorChange} />
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default PathAccordion;

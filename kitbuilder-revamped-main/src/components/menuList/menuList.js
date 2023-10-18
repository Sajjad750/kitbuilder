import React, { useEffect, useState } from "react";
import { Button, Grid, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Circle from '@uiw/react-color-circle';
import { setview, setfontcolor, setfontfamily, setselectedcolor } from "../../redux/canvasData/canvasData";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../customButton/customButton";
import { ColorPickerComponent } from "../customColorSwatch/ColorPicker";
import WebFont from "webfontloader";

function MenuList() {
    const [anchorEl0, setAnchorEl0] = React.useState(null);
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [selectedfont, setselectedfont] = useState("");
    const dispatch = useDispatch();
    const { fieldvalue, selectedcolor } = useSelector((state) => state.canvas);

    function handleClick(event, index) {
        if (index === 0 && anchorEl0 !== event.currentTarget) {
            setAnchorEl0(event.currentTarget);
        } else if (index === 1 && anchorEl1 !== event.currentTarget) {
            setAnchorEl1(event.currentTarget);
        } else if (index === 2 && anchorEl2 !== event.currentTarget) {
            setAnchorEl2(event.currentTarget);
        }
    }

    useEffect(() => {
        console.log(selectedcolor, "selectedcolor selectedcolor");
    }, [selectedcolor]);

    function handleClose() {
        setAnchorEl0(null);
        setAnchorEl1(null);
        setAnchorEl2(null);
    }


    const mainList = [
        { id: "1145", name: "CHOOSE FONT" },
        { id: "2245", name: "CHOOSE COLOUR" }
    ];

    // State for the list of fonts
    // State for the list of fonts
    const [fontsList, setFontsList] = useState([
        "Roboto", "Open Sans", "Lato", "Montserrat", "Raleway", 
        "Oswald", "Source Sans Pro", "Merriweather", "Ubuntu", "PT Sans", 
        "Noto Sans", "Fira Sans", "Playfair Display", "Poppins", "Arvo", 
        "Muli", "Nunito", "Cabin", "Libre Baskerville", "Zilla Slab", 
        "Quicksand", "Inconsolata", "Karla", "Exo 2", "Work Sans", 
        "Barlow", "Rubik", "Heebo", "Amatic SC", "Bitter", 
        "Varela Round", "Bree Serif", "Fjalla One", "Hind", "Pacifico", 
        "Yanone Kaffeesatz", "Abel", "Dancing Script", "Josefin Sans", "Vollkorn",
        "Alegreya", "Archivo Narrow", "Crete Round", "Dosis", "EB Garamond",
        "Faustina", "Gudea", "Ibarra Real Nova", "Jura", "Kalam",
        "Lora", "Martel", "Niconne", "Overpass", "Philosopher",
        "Rambla", "Stint Ultra Condensed", "Tangerine", "Vidaloka", "Yrsa"
    ]);

    useEffect(() => {
        WebFont.load({
            google: {
                families: fontsList
            }
        });
    }, []);




    const handleFontSelection = (fontName) => {
        // Set the selected font in the Redux store
        dispatch(setfontfamily(fontName));
        handleClose();
    };

    return (
        <div>
            <Grid container justifyContent={"space-between"}>
                {
                    mainList.map((item, index) => {
                        return (
                            <Grid key={item.id} item xs={12} md={4} mt={3} sx={{
                                display: { xs: null, md: "flex" },
                                justifyContent: { xs: null, md: "space-evenly" },
                            }}>
                                <CustomButton
                                    className="nunito-b"
                                    backgroundColor="#960909"
                                    fontColor="white"
                                    hoverColor="white"
                                    hoverFontColor="#960909"
                                    border="2px solid #960909"
                                    borderRadius="5px"
                                    width="240px" // Adjust the width as per your requirement
                                    height="42px"
                                    fontSize="12px"
                                    aria-owns={"simple-menu"}
                                    aria-haspopup="true"
                                    onClick={(event) => {
                                        handleClick(event, index);
                                    }}
                                >
                                    {item.name} <ArrowRightIcon />
                                </CustomButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl0}
                                    open={Boolean(anchorEl0)}
                                    onClose={handleClose}
                                    MenuListProps={{ onMouseLeave: handleClose }}
                                >
                                    <Box sx={{ border: "1px solid black" }}>
                                        {
                                            fontsList.map((fontName, index) => (
                                                <MenuItem key={index}
                                                    style={{ fontFamily: fontName }}
                                                    onClick={() => handleFontSelection(fontName)}>
                                                    <font style={{ fontFamily: fontName }}>
                                                        {fieldvalue ? fieldvalue : fontName}
                                                    </font>
                                                </MenuItem>
                                            ))
                                        }
                                    </Box>
                                </Menu>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl1}
                                    open={Boolean(anchorEl1)}
                                    onClose={handleClose}
                                    MenuListProps={{ onMouseLeave: handleClose }}
                                    sx={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Box sx={{ border: "1px solid black", width: "100%" }}>
                                        <ColorPickerComponent
                                            color={selectedcolor}
                                            onChange={(color) => {
                                                dispatch(setfontcolor(color));
                                                dispatch(setselectedcolor(color));
                                            }}
                                        />
                                    </Box>
                                </Menu>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </div>
    );
}

export default MenuList;

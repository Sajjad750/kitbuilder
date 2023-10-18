import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { setcanvas, setpaths, setactiveSide, setfieldvalue, setselectedDesignId, setselectedimagef, setselectedimageb, settextUploadTimestamp, setfontcolor, setfontfamily, setselectedcolor, setview } from '../../redux/canvasData/canvasData';
import './editcanvas.css'
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import axios from 'axios';
import { closeLoader, openLoader } from '../../redux/Loader/loaderSlice';
import { Button } from '@mui/material';
// const deleteIcon = "/bin-icon.svg";


export const CanvasEditor = ({ setIsButtonPressed, isButtonPressed, prouctChangeTimeStamp, setprouctChangeTimeStamp }) => {

    const { activeproduct, pathColors, pathColorsFront, pathColorsBack } = useSelector((state) => state.userdata)
    const { view, fieldvalue, fontcolor, fontfamily, activeside, imageUploadTimestamp, textUploadTimestamp, selectedDesignId, selectedimagef, selectedimageb } = useSelector((state) => state.canvas)
    const dispatch = useDispatch()
    // const apiUrl = "https://frontend-services-five.vercel.app/api/canvas-preview";
    const apiUrl = "http://localhost:5001/api/canvas-preview";
    const deleteIcon = "https://res.cloudinary.com/da60naxj0/image/upload/v1689331704/userUploads/bin-icon_j4qpha.svg"
    let URL = config.url.API_URL
    // New Code Added 
    const fabricRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const hiddenCanvasRef = React.useRef(null);


    // const initialRender = useRef(true);


    const navigate = useNavigate();

    const [tempDesign, settempDesign] = useState({
        front: {
            data: null,
            designPreview: "",
        },
        back: {
            data: null,
            designPreview: "",
        }
    })

    const [frontSide, setfrontSide] = useState(null)
    const [backSide, setbackSide] = useState(null)
    const [designModified, setDesignModified] = useState(false);


    const storePrevSide = () => {
        if (activeside === 'front') {
            const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
            setfrontSide(canvasData)
        } else {
            const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
            setbackSide(canvasData)
        }
    }

    const handleDataSaved = () => {
        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
        settempDesign(prevState => ({
            ...prevState,
            [activeside]: {
                ...prevState[activeside],
                data: canvasData
            }
        }));
        setDesignModified(true); // Set designModified to true when design is saved
    };

    // old
    // const handleDataSaved = () => {
    //     const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
    //     settempDesign(prevState => ({
    //         ...prevState,
    //         [activeside]: {
    //             ...prevState[activeside],
    //             data: canvasData
    //         }
    //     }))
    // };

    // #############################################################################################
    // Canvas Action Functions
    // #############################################################################################
    // dispatch(setcanvas(fabricRef.current))

    function deleteObject(eventData, transform, x, y) {
        const target = transform.target;
        const canvas = target.canvas;

        if (canvas.getActiveObjects().length > 1) {
            const activeObjects = canvas.getActiveObjects();
            activeObjects.forEach((obj) => {
                canvas.remove(obj);
            });
        } else {
            canvas.remove(target);
        }
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }


    function renderIcon(url) {
        return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
            const size = this.cornerSize;
            const x = left + this.x * size - 20; // Adjust the x position
            const y = top + this.y * size; // Adjust the y position
            const img = new Image();
            img.src = url;

            img.onload = function () {
                ctx.save();
                ctx.translate(x, y); // Move the coordinate system to the custom position
                ctx.drawImage(img, 0, 0, size, size); // Draw the image at (0, 0)
                ctx.restore();
            };
        };
    }




    React.useEffect(() => {
        const initFabric = () => {
            fabric.Object.prototype.controls.deleteControl = new fabric.Control({
                x: 0.58,
                y: -0.22,
                offsetX: 10, // Moves the control 10px to the right
                offsetY: -26,
                cursorStyle: 'pointer',
                mouseUpHandler: deleteObject,
                touchActionHandler: deleteObject,
                render: renderIcon(deleteIcon),
                cornerSize: 20
            });

            fabricRef.current = new fabric.Canvas(canvasRef.current, {
                width: 600,
                height: 400,
                backgroundColor: "white",
            });

            dispatch(setcanvas(fabricRef.current))

            let fabricCanvas = document.querySelector(".lower-canvas");
            let fabricCanvas2 = document.querySelector(".upper-canvas");
            if (fabricCanvas && fabricCanvas2) {
                fabricCanvas.style.border = "0px";
                fabricCanvas2.style.border = "0px";
            }
        };

        const disposeFabric = () => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                dispatch(setcanvas(null))
            }
        };

        initFabric();

        fabricRef.current.on('mouse:down', (e) => {
            if (e.target && e.target.isType('i-text')) {
                const newValue = e.target.text;
                dispatch(setfieldvalue(newValue));
            }
            handleDataSaved()
        });


        return () => {
            dispatch(setselectedimagef(""))
            dispatch(setselectedimageb(""))
            disposeFabric();

        };
    }, []);


    // React.useEffect(() => {
    //     const initFabric = () => {
    //         // console.log("canvas created!")
    //         fabricRef.current = new fabric.Canvas(canvasRef.current, {
    //             width: 400,
    //             height: 400,
    //             backgroundColor: "white",
    //             // backgroundColor: "#f0f0f0",
    //         });

    //         dispatch(setcanvas(fabricRef.current))
    //         let fabricCanvas = document.querySelector(".lower-canvas");
    //         let fabricCanvas2 = document.querySelector(".upper-canvas");
    //         if (fabricCanvas && fabricCanvas2) {
    //             fabricCanvas.style.border = "0px";
    //             fabricCanvas2.style.border = "0px";
    //         }

    //     };

    //     const disposeFabric = () => {
    //         fabricRef.current.dispose();
    //         dispatch(setcanvas(null))
    //     };

    //     initFabric();
    //     fabricRef.current.on('mouse:down', (e) => {
    //         handleDataSaved()
    //     });

    //     return () => {
    //         disposeFabric();
    //     };
    // }, []);


    // #########################################################################################
    // This code is used for SVG manipulation
    // #########################################################################################
    const loadSvg = useCallback((updatedFrontSide = frontSide, updatedBackSide = backSide) => {
        // This function applies the colors from pathColors to the SVG paths
        const applyColorsToPaths = (paths) => {
            if (designModified) return; // If design has been modified, skip applying pathColors
            console.log(pathColorsFront,"path colors front")
            console.log(pathColorsBack,"path colors back")
            const currentPathColors = activeside === 'front' ? pathColorsFront : pathColorsBack;
        
            paths.forEach(path => {
                const name = path.id; // Assuming the name is stored in 'id'
                const colorToApply = currentPathColors[name];
                if (colorToApply) {
                    path.set('fill', colorToApply);
                }
            });
        };
        
        if (activeproduct && activeside && fabricRef.current && !selectedDesignId) {
            if (activeside === 'front' && updatedFrontSide) {
                fabricRef.current.loadFromJSON(updatedFrontSide, function () {
                    const objectsD = fabricRef.current.getObjects();
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.Path || obj instanceof fabric.Group) {
                            obj.set('selectable', false);
                            obj.set('id', 'svg-design');
                            const paths = obj.getObjects().filter(obj => obj.type === 'path');
                            applyColorsToPaths(paths); // Apply the colors after loading the paths
                            dispatch(setpaths(paths));
                        }
                    });
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.IText) {
                            obj.on('changed', function () {
                                const newValue = obj.text;
                                dispatch(setfieldvalue(newValue));
                                handleDataSaved();
                            });
                            obj.on('mouseup', () => {
                                handleDataSaved();
                            });
                        }
                    });
                    fabricRef.current.renderAll();
                    handleDataSaved();
                });
            } else if (activeside === 'back' && updatedBackSide) {
                fabricRef.current.loadFromJSON(updatedBackSide, function () {
                    const objectsD = fabricRef.current.getObjects();
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.Path || obj instanceof fabric.Group) {
                            obj.set('selectable', false);
                            obj.set('id', 'svg-design');
                            const paths = obj.getObjects().filter(obj => obj.type === 'path');
                            applyColorsToPaths(paths); // Apply the colors after loading the paths
                            dispatch(setpaths(paths));
                        }
                    });
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.IText) {
                            obj.on('changed', function () {
                                const newValue = obj.text;
                                dispatch(setfieldvalue(newValue));
                                handleDataSaved();
                            });
                            obj.on('mouseup', () => {
                                handleDataSaved();
                            });
                        }
                    });
                    fabricRef.current.renderAll();
                    handleDataSaved();
                });
            } else {
                fabricRef.current.clear();
                fabricRef.current.setBackgroundColor('white', fabricRef.current.renderAll.bind(fabricRef.current));
                const existingSvgObject = fabricRef.current.getObjects().find(obj => obj.id === 'svg-design');
                if (existingSvgObject) {
                    const svgLink = (activeside === 'front') ? activeproduct.linkfront : activeproduct.linkback;
                    if (existingSvgObject.src === svgLink) {
                        return;
                    }
                    fabricRef.current.remove(existingSvgObject);
                }

                let svgLink = '';
                if (activeside === 'front') {
                    svgLink = activeproduct.linkfront;
                } else if (activeside === 'back') {
                    svgLink = activeproduct.linkback;
                }

                if (svgLink === '') {
                    return;
                }

                fabric.loadSVGFromURL(svgLink, function (objects, options) {
                    const svgimage = fabric.util.groupSVGElements(objects, options);
                    const paths = svgimage.getObjects().filter(obj => obj.type === 'path');
                    applyColorsToPaths(paths); // Apply the colors after loading the paths
                    dispatch(setpaths(paths));
                    svgimage.scale(1.7);
                    svgimage.set({ id: 'svg-design', crossOrigin: 'anonymous', selectable: false });
                    const canvasContainer = document.querySelector('.canvas-container');
                    canvasContainer.style.margin = '0px auto';
                    fabricRef.current.add(svgimage);
                    svgimage.sendToBack();

                    const canvasWidth = fabricRef.current.getWidth();
                    const canvasHeight = fabricRef.current.getHeight();
                    if (svgimage.getScaledWidth() > canvasWidth) {
                        svgimage.scaleToWidth(canvasWidth);
                    }
                    if (svgimage.getScaledHeight() > canvasHeight) {
                        svgimage.scaleToHeight(canvasHeight);
                    }

                    svgimage.centerH();
                    svgimage.centerV();

                    fabricRef.current.renderAll();
                    handleDataSaved();
                });
            }
        }
        setprouctChangeTimeStamp(false);
    }, [activeproduct, activeside, fabricRef, selectedDesignId, dispatch, frontSide, backSide]);



    const loadDesignFromLocalStorage = useCallback(() => {
        if (selectedDesignId && fabricRef.current) {
            if (activeside === "front" && frontSide) {
                console.log("######## New Front mechanism  ########")
                fabricRef.current.loadFromJSON(frontSide, function () {
                    const objectsD = fabricRef.current.getObjects();
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.Path || obj instanceof fabric.Group) {
                            // Apply properties to SVG objects
                            obj.set('selectable', false);
                            obj.set('id', 'svg-design');
                            const paths = obj.getObjects().filter(obj => obj.type === 'path');
                            dispatch(setpaths(paths));
                        }
                    });
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.IText) {
                            // Set the event handlers for the IText object
                            obj.on('changed', function () {
                                const newValue = obj.text;
                                dispatch(setfieldvalue(newValue));
                                handleDataSaved();
                            });
                            obj.on('mouseup', () => {
                                handleDataSaved();
                            });
                        }
                    });
                    fabricRef.current.renderAll();
                    handleDataSaved();
                });

            } else if (activeside === "back" && backSide) {
                console.log("######## New Back mechanism  ########")
                fabricRef.current.loadFromJSON(backSide, function () {
                    const objectsD = fabricRef.current.getObjects();
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.Path || obj instanceof fabric.Group) {
                            // Apply properties to SVG objects
                            obj.set('selectable', false);
                            obj.set('id', 'svg-design');
                            const paths = obj.getObjects().filter(obj => obj.type === 'path');
                            dispatch(setpaths(paths));
                        }
                    });
                    objectsD.forEach((obj) => {
                        if (obj instanceof fabric.IText) {
                            // Set the event handlers for the IText object
                            obj.on('changed', function () {
                                const newValue = obj.text;
                                dispatch(setfieldvalue(newValue));
                                handleDataSaved();
                            });
                            obj.on('mouseup', () => {
                                handleDataSaved();
                            });
                        }
                    });
                    fabricRef.current.renderAll();
                    handleDataSaved();
                });

            } else {
                const designs = JSON.parse(localStorage.getItem('designs')) || {};
                const designData = designs.filter((design) => design.id === selectedDesignId);
                if (designData.length > 0) {
                    const dataToLoad = designData[0];
                    const activeSideDataKey = activeside === 'front' ? 'front' : 'back';
                    // fabricRef.current.clear();
                    fabricRef.current.loadFromJSON(dataToLoad[activeSideDataKey].data, function () {
                        const objectsD = fabricRef.current.getObjects();
                        objectsD.forEach((obj) => {
                            if (obj instanceof fabric.Path || obj instanceof fabric.Group) {
                                // Apply properties to SVG objects
                                obj.set('selectable', false);
                                obj.set('id', 'svg-design');
                                const paths = obj.getObjects().filter(obj => obj.type === 'path');
                                dispatch(setpaths(paths));
                            }
                        });
                        objectsD.forEach((obj) => {
                            if (obj instanceof fabric.IText) {
                                // Set the event handlers for the IText object
                                obj.on('changed', function () {
                                    const newValue = obj.text;
                                    dispatch(setfieldvalue(newValue));
                                    handleDataSaved();
                                });
                                obj.on('mouseup', () => {
                                    handleDataSaved();
                                });
                            }
                        });
                        fabricRef.current.renderAll();
                        handleDataSaved();
                    });
                }

            }
        }
    }, [selectedDesignId, fabricRef, activeside]);



    useEffect(() => {
        loadDesignFromLocalStorage();
    }, [selectedDesignId, activeside]);

    const prevActiveSideRef = useRef(null);


    useEffect(() => {
        if (prevActiveSideRef.current !== activeside) {

            loadSvg();
            // alert("simple load")
            prevActiveSideRef.current = activeside;
        }
    }, [activeside, loadSvg])

    useEffect(() => {
        if (prouctChangeTimeStamp) {
            // Directly set the values
            setfrontSide(null)
            setbackSide(null)
            const updatedFrontSide = null;
            const updatedBackSide = null;

            // Call loadSvg with the updated values
            loadSvg(updatedFrontSide, updatedBackSide);
        }
    }, [prouctChangeTimeStamp]);






    // ############################################################################################
    // This code is used for TEXT manipulation.
    // ############################################################################################


    const addText = () => {
        if (fabricRef.current) {
            const canvas = fabricRef.current;
            canvas.discardActiveObject();
            let left = Math.floor(Math.random() * 31) + 50; // Generates a random number between 50 and 70 (inclusive)
            let top = Math.floor(Math.random() * 51) + 50; // Generates a random number between 50 and 80 (inclusive)
            let text = new fabric.IText(`${"Enter Text Here"}`, {
                left: left,
                top: top,
                fill: "black",
                fontSize: 20,
                fontFamily: "Arial",
                textAlign: "left",
                editable: true,
            });
            dispatch(setfieldvalue(`${"Enter Text Here"}`))
            canvas.add(text);
            canvas.setActiveObject(text);
            // Adding Event Handler to change fieldvalue as per the textbox value
            text.on('changed', function () {
                const newValue = text.text;
                dispatch(setfieldvalue(newValue))
                handleDataSaved()
            });
            text.on('mousedown', () => {
                // Handle the mouseup event
                handleDataSaved()
                // Detect the currently active text object
                const activeObject = canvas.getActiveObject();
                if (activeObject instanceof fabric.IText) {
                    // The currently active object is a text object
                    const textValue = activeObject.text;
                    console.log(textValue, "textValue textValue")
                    dispatch(setfieldvalue(textValue))
                    console.log("Active Text Object:", activeObject);
                }
            });
            handleDataSaved()
        }
    };

    function changeText() {
        const canvas = fabricRef.current;
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "i-text") {
            activeObject.set("text", fieldvalue);
            canvas.renderAll();
            handleDataSaved();
        }
    }


    useEffect(() => {
        if (fieldvalue) {
            changeText();
        }
        else {
            dispatch(setfieldvalue(""))
            const canvas = fabricRef.current;
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === "i-text") {
                activeObject.set("text", "");
                canvas.renderAll();
                handleDataSaved();
            }
        }
    }, [fieldvalue]);

    function changeFontFamily() {
        const canvas = fabricRef.current;
        // Check if the active object is an i-text instance
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "i-text" && fontfamily) {
            // Change the font family of the active object
            activeObject.set("fontFamily", fontfamily);

            // Render the canvas to reflect the updated font family
            canvas.renderAll();

            // Call any necessary additional functions
            handleDataSaved();
            // dispatch(setfontfamily(""))
        }
        // else{
        //     dispatch(setfontfamily(""))
        // }
        dispatch(setfontfamily(""))
    }

    function changeFill() {
        const canvas = fabricRef.current;
        // Check if the active object is an i-text instance
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "i-text") {
            // Change the fill color of the active object
            activeObject.set("fill", fontcolor);
            // Render the canvas to reflect the updated fill color
            canvas.renderAll();
            // Call any necessary additional functions
            handleDataSaved();
            dispatch(setfontcolor(""))
        } else {
            dispatch(setselectedcolor(""))
            dispatch(setfontcolor(""))
        }
    }

    function changePosition() {
        const canvas = fabricRef.current;
        // Check if the active object is an i-text instance
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "i-text" && view) {
            // Change the position of the active object based on the selected view
            if (view === "FRONT") {
                activeObject.set({ left: 160, top: 80 });
            } else if (view === "REAR LEFT") {
                activeObject.set({ left: 120, top: 80 });
            } else if (view === "REAR RIGHT") {
                activeObject.set({ left: 200, top: 80 });
            } else if (view === "BOTTOM") {
                activeObject.set({ left: 160, top: 200 });
            }

            // Render the canvas to reflect the updated position
            canvas.renderAll();

            // Call any necessary additional functions
            handleDataSaved();

        }
        dispatch(setview(""))
    }

    useEffect(() => {
        if (textUploadTimestamp) {
            // alert("added text")
            addText()
            dispatch(settextUploadTimestamp(false))
        }
    }, [textUploadTimestamp])

    useEffect(() => {
        changeFontFamily();
    }, [fontfamily]);
    useEffect(() => {
        if (fontcolor) {
            changeFill();
        }
    }, [fontcolor]);
    useEffect(() => {
        changePosition();
    }, [view]);

    const addImageToCanvas = (imageLink) => {
        if (fabricRef.current && activeside) {
            const canvas = fabricRef.current;
            fabric.Image.fromURL(imageLink, (img) => {
                const maxWidth = canvas.width * 0.9; // maximum width of the display area
                const maxHeight = canvas.height * 0.9; // maximum height of the display area
                const imageWidth = img.width; // original width of the image
                const imageHeight = img.height; // original height of the image
                let scale = 1;

                if (imageWidth > maxWidth) {
                    scale = maxWidth / imageWidth;
                }

                if (imageHeight * scale > maxHeight) {
                    scale = maxHeight / imageHeight;
                }

                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    crossOrigin: 'anonymous'
                });
                img.on('mouseup', () => {
                    handleDataSaved()
                });
                canvas.add(img);
                canvas.renderAll();
            });
        }
    };

    // Trigger addImageToCanvas function when an image is selected
    useEffect(() => {
        if (activeside === 'front' && selectedimagef) {
            addImageToCanvas(selectedimagef, 'front');
        } else if (activeside === 'back' && selectedimageb) {
            addImageToCanvas(selectedimageb, 'back');
        }
    }, [selectedimagef, selectedimageb, imageUploadTimestamp]);
    // }, [activeside, imageUploadTimestamp]);


    useEffect(() => {
        // console.log(isButtonPressed, "isButtonPressed")
        if (isButtonPressed) {
            if (selectedDesignId) {
                saveDesign(selectedDesignId)
            } else {
                saveDesign()
            }
            setIsButtonPressed(false)
        }
    }, [isButtonPressed])



    const initFabric = async (activeproduct) => {
        if (activeproduct) {
            const initFabric = (ref, svgLink) => {
                return new Promise((resolve, reject) => {
                    const fabricCanvas = new fabric.Canvas(ref.current, {
                        width: 600,
                        height: 400,
                        // backgroundColor: "rgba(130, 148, 203, 0.5)",
                        backgroundColor: "white",
                        visible: false,
                    });

                    fabricCanvas.wrapperEl.classList.add("hidden-canvas");
                    fabric.loadSVGFromURL(svgLink, function (objects, options) {
                        const svgimage = fabric.util.groupSVGElements(objects, options);
                        // Calculate the scale factor to fit the SVG to the canvas while maintaining aspect ratio
                        const scale = Math.min(
                            fabricCanvas.width / svgimage.width,
                            fabricCanvas.height / svgimage.height
                        );

                        svgimage.scale(scale);

                        // Center the SVG image
                        svgimage.center();

                        svgimage.centerH();
                        svgimage.centerV();

                        const canvasContainer = document.querySelector('.canvas-container');
                        canvasContainer.style.margin = '0px auto';

                        fabricCanvas.add(svgimage);
                        svgimage.sendToBack();
                        fabricCanvas.renderAll();

                        const canvasData = JSON.stringify(fabricCanvas.toJSON(['id']));
                        resolve(canvasData);
                    });
                });
            };

            if (activeside === "front") {
                return initFabric(hiddenCanvasRef, activeproduct.linkback)
                    .then(Data => {
                        return Data
                    })
                    .catch(error => {
                        console.error('Error loading SVG:', error);
                    });
            } else {
                return initFabric(hiddenCanvasRef, activeproduct.linkfront)
                    .then(Data => {
                        return Data
                    })
                    .catch(error => {
                        console.error('Error loading SVG:', error);
                    });

            }
        }

        return Promise.resolve(null);
    }

    // const getCanvasData = () => JSON.stringify(fabricRef.current.toJSON(['id']));

    // const generateDesign = async (side1Data, side2Data) => ({
    //     id: Date.now(),
    //     front: {
    //         data: side1Data,
    //         designPreview: await savePreview(side1Data),
    //     },
    //     back: {
    //         data: side2Data,
    //         designPreview: await savePreview(side2Data),
    //     }
    // });

    // const saveDesign = async (designkey = null) => {
    //     if (!fabricRef.current) return;

    //     const designs = JSON.parse(localStorage.getItem("designs")) || [];
    //     const activeSideDataKey = activeside === 'front' ? 'front' : 'back';
    //     const inactiveSideDataKey = activeside === 'front' ? 'back' : 'front';
    //     const existingDesignIndex = designs.findIndex(design => design.id == designkey);

    //     let side1Data, side2Data, savedDesignObject;
    //     if (existingDesignIndex !== -1) {
    //         side1Data = frontSide || backSide || getCanvasData();
    //         side2Data = backSide || frontSide || getCanvasData();

    //         designs[existingDesignIndex][activeSideDataKey].data = side1Data;
    //         designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(side1Data);
    //         designs[existingDesignIndex][inactiveSideDataKey].data = side2Data;
    //         designs[existingDesignIndex][inactiveSideDataKey].designPreview = await savePreview(side2Data);
    //     } else {
    //         side1Data = frontSide || getCanvasData();
    //         side2Data = backSide || getCanvasData();

    //         savedDesignObject = await generateDesign(side1Data, side2Data);
    //         designs.push(savedDesignObject);
    //     }

    //     localStorage.setItem("designs", JSON.stringify(designs));
    //     const designsData = JSON.parse(localStorage.getItem("designs"));
    //     console.log(designsData, "designsData designsData designsData");

    //     dispatch(setselectedDesignId(designkey || savedDesignObject.id));

    //     navigate('/saveddesigns');
    // };


    const saveDesign = async (designkey = null) => {
        if (fabricRef.current) {
            dispatch(openLoader(true))
            // storePrevSide()
            const designs = JSON.parse(localStorage.getItem("designs")) || [];
            const designId = Date.now();
            const activeSideDataKey = activeside === 'front' ? 'front' : 'back';
            const existingDesignIndex = designs.findIndex(design => design.id == designkey);
            if (existingDesignIndex !== -1) {
                // alert("History loading Design")
                if (activeSideDataKey === 'front') {
                    if (frontSide && backSide) {
                        // alert("frontSide && backSide")
                        designs[existingDesignIndex][activeSideDataKey].data = frontSide;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(frontSide);
                        designs[existingDesignIndex]['back'].data = backSide;
                        designs[existingDesignIndex]['back'].designPreview = await savePreview(backSide);
                    } else if (frontSide) {
                        // alert("frontSide only")
                        designs[existingDesignIndex][activeSideDataKey].data = frontSide;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(frontSide);
                        // Get current Data on Canvas and Load it into local Storage
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex]['back'].data = canvasData;
                        designs[existingDesignIndex]['back'].designPreview = await savePreview(canvasData);
                    } else if (backSide) {
                        // alert("backSide only")
                        designs[existingDesignIndex][activeSideDataKey].data = backSide;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(backSide);
                        // Get current Data on Canvas and Load it into local Storage
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex]['front'].data = canvasData;
                        designs[existingDesignIndex]['front'].designPreview = await savePreview(canvasData);
                    } else if (!backSide && !frontSide) {
                        // alert("!backSide && !frontSide")
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex][activeSideDataKey].data = canvasData;
                        console.log(canvasData, "canvasData canvasData canvasData")
                        console.log(fabricRef.current, "fabricRef.current fabricRef.current")
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(canvasData);
                    }

                } else {
                    if (frontSide && backSide) {
                        // alert("frontSide && backSide top")
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex][activeSideDataKey].data = activeside === 'back' ? canvasData : backSide;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(activeside === 'back' ? canvasData : backSide);
                        designs[existingDesignIndex]['front'].data = activeside === 'front' ? canvasData : frontSide;
                        designs[existingDesignIndex]['front'].designPreview = await savePreview(activeside === 'front' ? canvasData : frontSide);
                    } else if (frontSide && !backSide) {
                        // alert("frontSide && !backSide")
                        designs[existingDesignIndex][activeSideDataKey].data = frontSide;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(frontSide);
                        // Get current Data on Canvas and Load it into local Storage
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex]['back'].data = canvasData;
                        designs[existingDesignIndex]['back'].designPreview = await savePreview(canvasData);
                    } else if (backSide && !frontSide) {
                        // alert("backSide && !frontSide")
                        designs[existingDesignIndex][activeSideDataKey].data = backSide;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(backSide);
                        // Get current Data on Canvas and Load it into local Storage
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex]['front'].data = canvasData;
                        designs[existingDesignIndex]['front'].designPreview = await savePreview(canvasData);
                    } else if (!backSide && !frontSide) {
                        // alert("!backSide && !frontSide")
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        designs[existingDesignIndex][activeSideDataKey].data = canvasData;
                        designs[existingDesignIndex][activeSideDataKey].designPreview = await savePreview(canvasData);
                    }

                }
                navigate('/saveddesigns')
            } else {
                let savedDesignObject = {}
                // alert("new Design...")
                if (frontSide && backSide) {
                    // alert("frontSide && backSide else")
                    const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                    const newDesign = {
                        id: designId,
                        front: {
                            // If active side is 'front', use canvasData, otherwise use frontSide
                            data: activeside === 'front' ? canvasData : frontSide,
                            // Also use the same logic in savePreview function
                            designPreview: await savePreview(activeside === 'front' ? canvasData : frontSide),
                        },
                        back: {
                            data: activeside === 'back' ? canvasData : backSide,
                            designPreview: await savePreview(activeside === 'back' ? canvasData : backSide),
                        }
                    };
                    savedDesignObject = newDesign
                }
                else if (frontSide && !backSide) {
                    // alert("frontSide && !backSide")
                    const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                    const newDesign = {
                        id: designId,
                        front: {
                            data: frontSide,
                            designPreview: await savePreview(frontSide),
                        },
                        back: {
                            data: canvasData,
                            designPreview: await savePreview(canvasData),
                        }
                    };
                    savedDesignObject = newDesign

                } else if (backSide && !frontSide) {
                    // alert("backSide && !frontSide")
                    const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                    const newDesign = {
                        id: designId,
                        front: {
                            data: canvasData,
                            designPreview: await savePreview(canvasData),
                        },
                        back: {
                            data: backSide,
                            designPreview: await savePreview(backSide),
                        }
                    };
                    savedDesignObject = newDesign

                } else if (!backSide && !frontSide) {
                    // alert("!backSide && !frontSide")
                    if (activeside === 'front') {
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        const dataCanvas = await initFabric(activeproduct)
                        // console.log(dataCanvas,"##### dataCanvas #####")
                        // Generate Backside
                        const newDesign = {
                            id: designId,
                            front: {
                                data: canvasData,
                                designPreview: await savePreview(canvasData),
                            },
                            back: {
                                data: dataCanvas,
                                designPreview: await savePreview(dataCanvas),
                            }
                        };
                        savedDesignObject = newDesign
                    } else {
                        // Generate Frontside
                        // alert("else generate Frontside")
                        const canvasData = JSON.stringify(fabricRef.current.toJSON(['id']));
                        const dataCanvas = await initFabric(activeproduct)
                        const newDesign = {
                            id: designId,
                            front: {
                                data: dataCanvas,
                                designPreview: await savePreview(dataCanvas),
                            },
                            back: {
                                data: canvasData,
                                designPreview: await savePreview(canvasData),
                            }
                        };
                        savedDesignObject = newDesign
                    }

                }
                designs.push(savedDesignObject);
            }
            localStorage.setItem("designs", JSON.stringify(designs));
            const designsData = JSON.parse(localStorage.getItem("designs"));
            console.log(designsData, "designsData designsData designsData")
            if (designkey) {
                // console.log(designkey, "designkey")
                dispatch(setselectedDesignId(designkey))
            } else {
                // console.log(designId, "designId")
                dispatch(setselectedDesignId(designId))
            }
            // alert("Design Saved");
        }
        dispatch(closeLoader(false))
        navigate('/saveddesigns')
    };


    const savePreview = async (DesignData) => {
        try {
            // dispatch(openLoader(true))
            const designs = JSON.parse(localStorage.getItem("designs")) || [];
            const response = await axios.post(`${apiUrl}`, { design: DesignData });
            // Handle the response from the server
            // dispatch(closeLoader(false))
            return response.data
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px' }}>
                <img onClick={() => {
                    storePrevSide()
                    if (activeside === "front") {
                        dispatch(setactiveSide("back"))
                    } else if (activeside === "back") {
                        dispatch(setactiveSide("front"))
                    }
                }} style={{ cursor: "pointer" }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693223627/userUploads/Group_253_c3ghta.png"} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="canvas-container" style={{ margin: '0 auto' }}>
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
}
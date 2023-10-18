import { fabric } from 'fabric';


// This Function Downloads the Current Scene in Canvas
export  const downloadImage = (canvas) => {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "kitBuilder.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// Later please  change it into Indexes not with named strings
// This Function changes the Text Position from Editor
export const changeView = (arg,canvas,textInstance) => {
    console.log("function chala")
    if (arg === "FRONT" || arg === "BACK") {
        textInstance.set({ left: 125, top: 220 })
        canvas.add(textInstance).renderAll()
    } else if (arg === "REAR LEFT") {
        textInstance.set({ left: 80, top: 125 })
        canvas.add(textInstance).renderAll()
    } else if (arg === "REAR RIGHT") {
        textInstance.set({ left: 180, top: 125 })
        canvas.add(textInstance).renderAll()
    }
}


// This function adds the color to font on canvas
export const changeColor = (canvas,textInstance,fieldvalue,fontcolor) => {
    textInstance.set({ fill: fontcolor })
    canvas.add(textInstance).renderAll();
}

// This Function adds font family to the text
export const changefontFamily = (fontfamily,textInstance,canvas) => {
    const canvasObjects = canvas.getObjects();
    const textbox = canvasObjects.find(obj => obj.name === 'textbox');
    if (textbox) {
        console.log(`Object angle: ${textbox.get('angle')}`);
        const currentScaleX = textbox.get('scaleX');
        const currentScaleY = textbox.get('scaleY');
        console.log(currentScaleX,"XY",currentScaleY)
      // the textbox is already on the canvas, update its properties
      textbox.set({
        fontFamily: fontfamily
        // other properties to update
      });
      canvas.renderAll()
    }
}


const handleLogoUpload=(image,canvas,setlogoInstance,dispatch)=>{
    fabric.Image.fromURL(image, function (image) {
        // calculate the desired width and height of the image
        const maxWidth = 60; // maximum width of the display area
        const maxHeight = 60; // maximum height of the display area
        const imageWidth = image.width; // original width of the image
        const imageHeight = image.height; // original height of the image
        let scale = 1;

        if (imageWidth > maxWidth) {
            scale = maxWidth / imageWidth;
        }

        if (imageHeight * scale > maxHeight) {
            scale = maxHeight / imageHeight;
        }
        image.set({
            left: 80,
            top: 125,
            scaleX: scale,
            scaleY: scale,
            // id: `currentImg${frontimages.length - 1}`,
        });
        dispatch(setlogoInstance(image))
        canvas.add(image).renderAll();
    });
}

// This function Loads logo on canvas 

export const loadLogo = (frontimages,canvas,logoInstance,setlogoInstance,dispatch,selectedimagef) => {
    console.log(selectedimagef,"selectedimagef")
    const Objects = canvas.getObjects()
    if(Objects.length > 0){
        Objects.forEach(obj => {
            console.log(obj)
            if(obj === logoInstance){
                canvas.remove(obj).renderAll()
            }
        });
    }

    
    if(selectedimagef){
    console.log(frontimages,"if chali")
        frontimages.forEach(image => {
            if(selectedimagef === image){
                handleLogoUpload(image,canvas,setlogoInstance,dispatch)
            }
        });
    }else{
    console.log(frontimages,"else chali")
        handleLogoUpload(frontimages[frontimages.length - 1],canvas,setlogoInstance,dispatch)
    }


}

// This function is used to load Text on canvas

export const loadText=(settextInstance,dispatch,fieldvalue,canvas,setfieldvalue)=>{
    if(canvas){
        var textbox = new fabric.Textbox(fieldvalue, {
            fontSize: 25,
            fill: 'white',
            selectable: true,
            top: 220,
            left: 125,
            name:"textbox"
        });
        console.log(textbox,"textbox from Loadtext")
        console.log(canvas,"canvas from Loadtext")
        dispatch(settextInstance(textbox))
        canvas.add(textbox).renderAll()
        textbox.on('changed', function() {
            console.log(textbox)
            let objects = canvas.getObjects()
            console.log("canvas objects",objects)
            console.log("canvas objects",objects)
            const newValue = textbox.text;
            dispatch(setfieldvalue(newValue))
          });
    }
}

// This function helps add the text from Input field to Canvas
export const addText = (canvas,fieldvalue) => {
    const canvasObjects = canvas.getObjects();
    const textbox = canvasObjects.find(obj => obj.name === 'textbox');
    if (textbox) {
      // the textbox is already on the canvas, update its properties
      textbox.set({
        text: fieldvalue
        // other properties to update
      });
      canvas.renderAll()
    }
}

// This function is used to remove Text on canvas
export const removeText=(canvas)=>{
    const Objects = canvas.getObjects()
    Objects.forEach(function (object) {
        if (object.text) {
            canvas.remove(object).renderAll();
        }
    });
}

// This function is used to Extract Paths from Svg

const loadPath=(dispatch,setpaths,svgimage)=>{
    // Get all paths from the loaded SVG object
    var paths = svgimage.getObjects().filter(function (obj) {
        return obj.type === 'path';
    });
    dispatch(setpaths(paths))
}


// This Function is used to Load SVG Model on Canvas

export const loadSvg=(dispatch,setsvgInstance,canvas,setpaths,link)=>{
    fabric.loadSVGFromURL(link, function (objects, options) {
        var svgimage = fabric.util.groupSVGElements(objects, options);
        svgimage.scale(2)
        svgimage.selectable = false
        dispatch(setsvgInstance(svgimage))
        const canvasContainer = document.querySelector('.canvas-container');
        if(canvasContainer != null){
            console.log(canvasContainer,"canvasContainer")
            canvasContainer.style.margin = '0px auto';
        }
        loadPath(dispatch,setpaths,svgimage)
        canvas.add(svgimage).renderAll();
        svgimage.center()
        canvas.sendToBack(svgimage)
    });
}

// This Function Changes the Side of Product Front or Back
export const swapView = (canvas,setactive,active,initialLoader,canvasData,textInstance,svgInstance,dispatch) => {
    canvas.remove(svgInstance, textInstance);
    canvas.renderAll()
    if (active === canvasData.front) {
        dispatch(setactive(canvasData.back))
        initialLoader(canvasData.back)
    } else {
        dispatch(setactive(canvasData.front))
        initialLoader(canvasData.front)
    }
}

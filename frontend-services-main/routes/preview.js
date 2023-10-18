const express = require("express")
const router = express.Router();
const { createCanvas } = require('canvas');
const fabric = require('fabric').fabric;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'da60naxj0',
    api_key: '573867397279471',
    api_secret: 'A3lbIMFxYFcg0XDIhmM7n5C3hyc'
});

router.post('/', async (req, res) => {
    console.log("route hit ")
    const designData = req.body.design;
    if (!designData) return res.send('Invalid Design Data!');

    const canvasWidth = 600; // Updated width
    const canvasHeight = 400;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    const fabricCanvas = new fabric.StaticCanvas(null, { width: canvasWidth, height: canvasHeight, context: ctx });

    fabricCanvas.loadFromJSON(designData, async function () {
        // Center the SVG on the canvas
        const svgObject = fabricCanvas.getObjects().find(obj => obj.type === 'path' || obj.type === 'group'); // Adjust this if you have a specific way to identify the SVG
        if (svgObject) {
            svgObject.centerH();
            svgObject.centerV();
        }

        const dataURL = fabricCanvas.toDataURL({ format: 'png' });
        fabricCanvas.backgroundColor = 'transparent';
        fabricCanvas.getObjects().forEach((obj) => {
            obj.backgroundColor = 'transparent';
        });

        try {
            // Use await to handle the promise returned by cloudinary.uploader.upload
            const result = await cloudinary.uploader.upload(dataURL, { folder: 'canvas-preview-images' });
            const imageUrl = result.secure_url;
            res.send(imageUrl);
        } catch (error) {
            console.log('Error uploading image to Cloudinary:', error);
            res.status(500).send('Error uploading image to Cloudinary');
        }
    });
});

module.exports = router;

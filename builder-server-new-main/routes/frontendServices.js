// const express = require("express")
// const router = express.Router();
// const { createCanvas, loadImage } = require('canvas');
// const fabric = require('fabric').fabric;
// const cloudinary = require('cloudinary').v2;
// // Configure Cloudinary with your account details
// cloudinary.config({
//     cloud_name: 'da60naxj0',
//     api_key: '573867397279471',
//     api_secret: 'A3lbIMFxYFcg0XDIhmM7n5C3hyc'
// });

// router.post('/canvas-preview', (req, res) => {
//     // Extract the design data from the request body
//     const designData = req.body.design;
//     const canvas = createCanvas(400, 400);
//     const ctx = canvas.getContext('2d');
//     const fabricCanvas = new fabric.StaticCanvas(null, { width: 400, height: 400, context: ctx });

//     fabricCanvas.loadFromJSON(designData, function () {
//         const dataURL = fabricCanvas.toDataURL({ format: 'png' });
//         fabricCanvas.backgroundColor = 'transparent';
//         // Remove the background color from all objects
//         fabricCanvas.getObjects().forEach((obj) => {
//             obj.backgroundColor = 'transparent';
//         });
//         // Upload the image to Cloudinary
//         cloudinary.uploader.upload(dataURL, { folder: 'canvas-preview-images' }, (error, result) => {
//             if (error) {
//                 console.log('Error uploading image to Cloudinary:', error);
//                 res.status(500).send('Error uploading image to Cloudinary');
//             } else {
//                 // Retrieve the public URL of the uploaded image
//                 const imageUrl = result.secure_url;
//                 // Send the image URL back to the client
//                 res.send(imageUrl);
//             }
//         });
//     });
// });

// module.exports = router;
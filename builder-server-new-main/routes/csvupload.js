const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const { Product, productValidator } = require('./../models/product');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-csv', upload.single('csvfile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const retailerId = req.body.retailerId;

    const data = req.file.buffer;
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(data);

    bufferStream
        .pipe(csv())
        .on('data', async (row) => {
            const { ProductName, ProductImage, LinkFront, LinkBack } = row;

            // Create a product object based on the CSV row data
            const productData = {
                name: ProductName,
                productImage: ProductImage,
                linkfront: LinkFront,
                linkback: LinkBack,
                isActive: true  // Set isActive to true by default
            };

            // Conditionally add the retailerId if it's not 'null'
            if (retailerId && retailerId !== 'null') {
                productData.retailerId = retailerId;
            }

            // Validate the product data using Joi
            const { error } = productValidator(productData);
            if (error) {
                console.log(`Validation error for product ${ProductName}: ${error.details[0].message}`);
                return; // Skip this product and continue with the next one
            }

            // Save the product to the database
            const product = new Product(productData);
            await product.save();
        })
        .on('end', () => {
            res.send('CSV import completed.');
        });
});

module.exports = router;

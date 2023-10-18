const express = require("express");
const router = express.Router();
// const {Category } = require('../models/category')
// const {subCategory } = require('../models/subCategory')
const { productValidator, Product } = require('../models/product')
const auth = require('../middleware/auth')
const openAuth = require('../middleware/openAuth')
const Joi = require('joi');
const slugify = require('slugify');
const { categoryValidator, Category } = require('../models/category')


// Add new Product
router.post('/:id', auth, async (req, res) => {
  const { error } = productValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);

  // Check if the category exists
  if (!category) {
    return res.status(404).send('Category not found.');
  }

  let product = await Product.findOne({ name: req.body.name });
  if (product) return res.status(400).send('Product already registered.');

  try {
    let retailerIdValue = null;

    if (req.user.isRetailer) {
      retailerIdValue = req.user._id;
    }

    const productData = new Product({
      ...req.body,
      categories: [categoryId],
      retailerId: retailerIdValue
    });

    await productData.save();

    // Adding Product into category as well
    category.products.push(productData._id);
    await category.save();

    res.status(200).send(productData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// GET all products by category ID
router.get('/products/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// GET Product Data from DB
router.get('/', auth, async (req, res) => {
  try {
    // If the user is an admin, return all products
    if (req.user.isAdmin) {
      const productData = await Product.find({});
      if (productData.length < 1) return res.send("Sorry, there are no products available right now!");
      return res.status(200).send(productData);
    }

    // If the user is a retailer, find products that belong to categories associated with that retailer
    if (req.user.isRetailer) {
      const categories = await Category.find({ retailerId: req.user._id });
      const categoryIds = categories.map(category => category._id);
      const productData = await Product.find({ categories: { $in: categoryIds } });
      if (productData.length < 1) return res.send("Sorry, there are no products available for this retailer right now!");
      return res.status(200).send(productData);
    }

    // If the user doesn't match any known roles
    res.status(400).send("Invalid user role.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/getSpecificProducts/:id', async (req, res) => {
  // .populate('category')
  const id = req.params.id
  // .populate('category');
  const productData = await Product.find({ category: id })
  if (productData.length < 1) return res.send("Sorry There are no Products Available right Now!")
  res.status(200).send(productData)
})


// Delete Product Data
// Delete Product Data
router.delete('/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;

    // If the user is an admin, they can delete any product
    if (req.user.isAdmin) {
      await Product.findByIdAndDelete(productId);
    }
    // If the user is a retailer, they can only delete products associated with their retailerId
    else if (req.user.isRetailer) {
      const product = await Product.findById(productId);

      if (!product.retailerId.equals(req.user._id)) {
        return res.status(403).send('Access denied. Retailer can only delete their own products.');
      }

      await Product.findByIdAndDelete(productId);
    } else {
      return res.status(400).send('Invalid user role.');
    }

    // Remove the product reference from the categories
    await Category.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    res.send('Product successfully Deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// router.delete('/:id', async (req, res) => {
//   try {
//     const id = req.params.id
//     const productData = await Product.deleteMany({ _id: id });
//     if (!productData) {
//       return res.status(404).send('Product not found');
//     }
//     res.send('Product successfully Deleted');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });

// Update Product Data
router.put('/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;

    // If the user is a retailer, they can only update products associated with their retailerId
    if (req.user.isRetailer) {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send('Product not found.');
      }

      if (!product.retailerId.equals(req.user._id)) {
        return res.status(403).send('Access denied. Retailer can only update their own products.');
      }
    } else if (!req.user.isAdmin) {
      return res.status(400).send('Invalid user role.');
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

    res.send(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



// PUT request to update product status
router.put('/updateProductStatus/:id', openAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const { isActive } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).send('Product not found');
    product.isActive = isActive;
    await product.save();
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send('An error occurred while updating product status');
  }
});



router.put('/update-product-details/:productId', async (req, res) => {
  const { description, videoLink, imageGallery } = req.body;

  // Validate the incoming request body based on the fields of interest
  const tempProduct = { description, videoLink, productImage: imageGallery }; // using productImage for validation since we're not changing the validator function for imageGallery
  const { error } = productValidator(tempProduct);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).send('Product with the given ID was not found.');

    if (description) product.description = description;
    if (videoLink) product.videoLink = videoLink;
    if (imageGallery) product.imageGallery = imageGallery;

    await product.save();
    res.send(product);

  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
});




module.exports = router;
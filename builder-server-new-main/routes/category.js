const express = require("express");
const router = express.Router();
const { categoryValidator, Category } = require('../models/category')
const { productValidator, Product } = require('../models/product')
const slugify = require('slugify');
const cryptoUtils = require('../helperFunctions/cryptoUtils');
const { Retailer } = require('../models/retailer')
const openAuth = require('../middleware/openAuth')
const validateToken = require('../middleware/validateToken')
const auth = require('../middleware/auth')


// Get All Categories Data including categories and their childrens as independent entities
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get only Subcategories or Children of Specific Category
router.get('/:id/children', async (req, res) => {
  try {
    const { id } = req.params;
    const parentCategory = await Category.findById(id).populate('children');
    res.json(parentCategory.children);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



async function populateChildrencatData(category, depth) {
  if (depth <= 0 || !category.children) {
    return category;
  }

  // Populate children and products in the same chain
  category = await Category.findById(category._id).populate('children').populate('products');

  const populatedGrandChildren = await Promise.all(category.children.map(child => populateChildrencatData(child, depth - 1)));
  const children = populatedGrandChildren.map(child => ({
    _id: child._id,
    name: child.name,
    children: child.children,
    image: child.image,
    products: child.products
  }));

  return {
    _id: category._id,
    name: category.name,
    children,
    image: category.image,
    products: category.products
  };
}

router.get('/catData', auth, async (req, res) => {
  try {
    const { _id, isAdmin, isRetailer } = req.user;
    let categories = [];

    if (isAdmin) {
      categories = await Category.find({ parent: null });
    } else if (isRetailer) {
      categories = await Category.find({
        parent: null,
        $or: [
          { retailerId: _id },
          { restrictedRetailers: { $ne: _id } }
        ]
      });
    }

    if (categories.length === 0) {
      console.log("no Categories found");
      return res.status(404).json({ msg: 'No categories found for this user' });
    }

    const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50))); // pass in the maximum depth you want to populate
    res.json(populatedCategories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// router.get('/catData', openAuth, validateToken, async (req, res) => {
//   try {
//     console.log(req.user, "Decoded form of token")
//     const { _id, isAdmin, isRetailer } = req.user;
//     let categories = [];

//     if (isAdmin) {
//       categories = await Category.find({ parent: null });
//     } else if (isRetailer) {
//       categories = await Category.find({
//         parent: null,
//         retailerId: _id,
//         restrictedRetailers: { $ne: _id }
//       });
//     }

//     if (categories.length === 0) {
//       console.log("no Categories found")
//       return res.status(404).json({ msg: 'No categories found for this user' });
//     }

//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50))); // pass in the maximum depth you want to populate
//     console.log(populatedCategories, "populatedCategories")
//     res.json(populatedCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// New Route with Infinite Scroll

router.get('/catDataFront', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const idObject = JSON.parse(req.query.id);
    const decryptedRetId = cryptoUtils.decrypt(idObject); // Added const

    const retailer = await Retailer.findOne({ _id: decryptedRetId, isActivated: true });
    if (!retailer) {
      return res.status(404).json({ msg: 'Retailer not found or not activated' });
    }

    const categoryConditions = {
      parent: null,
      products: { $exists: true, $not: { $size: 0 } },
      restrictedRetailers: { $ne: retailer._id }
    };

    const categories = await Category.find(categoryConditions).skip(skip).limit(limit);
    const totalCount = await Category.countDocuments(categoryConditions);
    const hasMoreCategories = skip + limit < totalCount;

    if (categories.length === 0 && page === 1) {
      return res.status(404).json({ msg: 'No categories found for this retailer' });
    }

    const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50)));

    res.json({
      categories: populatedCategories,
      hasMoreCategories: hasMoreCategories
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// this code is commented after resting retailer side
// router.get('/catDataFront', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     console.log(page, "page")
//     console.log(limit, "limit")
//     console.log(skip, "skip")

//     const idObject = JSON.parse(req.query.id);
//     decryptedRetId = cryptoUtils.decrypt(idObject);
//     console.log(decryptedRetId, "decryptedRetId");

//     // Find the retailer
//     const retailer = await Retailer.findOne({ _id: decryptedRetId, isActivated: true });
//     if (!retailer) {
//       console.log("not found retailer this");
//       return res.status(404).json({ msg: 'Retailer not found or not activated' });
//     }

//     // In below code i have just commented the retailerId condition so that as of categories must show otherwise i need to remove it
//     // Find all categories
//     // Find all categories that have products
//     const categories = await Category.find({
//       parent: null,
//       products: { $exists: true, $not: { $size: 0 } }, // This condition checks for non-empty products array
//       restrictedRetailers: { $ne: retailer._id }
//     }).skip(skip).limit(limit);

//     // Check if there are more categories after the current batch
//     const totalCount = await Category.countDocuments({
//       parent: null,
//       products: { $exists: true, $not: { $size: 0 } }, // This condition checks for non-empty products array
//       restrictedRetailers: { $ne: retailer._id }
//     });
//     const hasMoreCategories = skip + limit < totalCount;

//     if (categories.length === 0 && page === 1) {
//       console.log("no Categories found");
//       return res.status(404).json({ msg: 'No categories found for this retailer' });
//     }

//     // Populate categories
//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50)));

//     // Return the categories and the hasMore flag
//     res.json({
//       categories: populatedCategories,
//       hasMoreCategories: hasMoreCategories
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// router.get('/catDataFront', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const idObject = JSON.parse(req.query.id);
//     decryptedRetId = cryptoUtils.decrypt(idObject);
//     console.log(decryptedRetId,"decryptedRetId")

//     // Find the retailer
//     const retailer = await Retailer.findOne({ _id: decryptedRetId, isActivated: true });
//     if (!retailer) {
//       console.log("not found retailer this")
//       return res.status(404).json({ msg: 'Retailer not found or not activated' });
//     }

//     // Find all categories
//     const categories = await Category.find({
//       parent: null,
//       retailerId: retailer._id,
//       restrictedRetailers: { $ne: retailer._id }
//     }).skip(skip).limit(limit);

//     if (categories.length === 0) {
//       console.log("no Cateogries found")
//       return res.status(404).json({ msg: 'No categories found for this retailer' });
//     }

//     // Populate categories
//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50)));
//     res.json(populatedCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// Search Bar route
router.get('/searchCategories', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;

    const idObject = JSON.parse(req.query.id);
    decryptedRetId = cryptoUtils.decrypt(idObject);

    // Find the retailer
    const retailer = await Retailer.findOne({ _id: decryptedRetId, isActivated: true });
    if (!retailer) {
      console.log("not found retailer")
      return res.status(404).json({ msg: 'Retailer not found or not activated' });
    }

    // Search categories based on the searchTerm
    const categories = await Category.find({
      name: { $regex: new RegExp(searchTerm, 'i') }, // Flexible, case-insensitive search
      // Removed parent: null condition to search for all categories
      restrictedRetailers: { $ne: retailer._id }
    }).skip(skip).limit(limit);


    if (categories.length === 0) {
      console.log("no Cateogries found")
      return res.status(404).json({ msg: 'No categories found for this search term' });
    }
    // Populate categories
    const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50)));
    // Check if there are more categories after the current batch
    const totalCount = await Category.countDocuments({
      name: { $regex: new RegExp(searchTerm, 'i') },
      // Removed parent: null condition from countDocuments as well
      restrictedRetailers: { $ne: retailer._id }
    });
    const hasMoreCategories = skip + limit < totalCount;
    res.json({
      categories: populatedCategories,
      hasMoreCategories: hasMoreCategories
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




// Recursive function to gather products from children and their nested children
async function gatherProducts(category) {
  let products = [];

  // If the category has products, add them to the products array
  if (category.products && category.products.length > 0) {
      products.push(...category.products);
  }

  // If the category has children, traverse through each child and gather their products
  if (category.children && category.children.length > 0) {
      for (let child of category.children) {
          const childProducts = await gatherProducts(child);
          products.push(...childProducts);
      }
  }

  return products;
}

router.get('/searchKit', async (req, res) => {
  try {
      const productId = req.query.searchTerm;
      const encryptedRetailerId = req.query.retailerId;

      if (!productId || !encryptedRetailerId) {
          return res.status(400).json({ msg: 'Product ID and retailer ID are required' });
      }

      // Decrypt the retailerId
      const decryptedRetailerId = cryptoUtils.decrypt(JSON.parse(encryptedRetailerId));

      // Find the product using the productId
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ msg: 'Product not found' });
      }

      // Use the first category associated with the product as the main category
      const mainCategoryId = product.categories[0];

      const mainCategory = await Category.findById(mainCategoryId);

      if (!mainCategory) {
          return res.status(404).json({ msg: 'Main category not found for the product' });
      }

      // Use the populateChildrencatData function to get sub-categories and their products
      const populatedMainCategory = await populateChildrencatData(mainCategory, 50);

      // Exclude the products of the main category
      populatedMainCategory.products = [];

      // Use the gatherProducts function to get all products from the sub-categories
      const allProductsFromSubCategories = await gatherProducts(populatedMainCategory);
      res.json(allProductsFromSubCategories);

  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});




// old code for name base searching on categories
// router.get('/searchKit', async (req, res) => {
//   try {
//     console.log("search kit hit")
//     const searchTerm = req.query.searchTerm;
//     const encryptedRetailerId = req.query.retailerId;

//     if (!searchTerm || !encryptedRetailerId) {
//       return res.status(400).json({ msg: 'Search term and retailer ID are required' });
//     }

//     // Decrypt the retailerId
//     const decryptedRetailerId = cryptoUtils.decrypt(JSON.parse(encryptedRetailerId));

//     // Find categories associated with the retailer
//     const categories = await Category.find({ retailerId: decryptedRetailerId });
//     const categoryIds = categories.map(category => category._id);

//     // Find products that match the search term and belong to one of the categories
//     const products = await Product.find({
//       name: { $regex: new RegExp(searchTerm, 'i') }, // Case-insensitive search
//       categories: { $in: categoryIds }
//     });

//     res.json({ products });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });







// Polo Information

router.put('/update-category-details/:categoryId', async (req, res) => {
  const { description, videoLink, imageGallery } = req.body;

  if (!description && !videoLink && !imageGallery) {
    return res.status(400).send("At least one of 'description', 'videoLink', or 'imageGallery' is required.");
  }

  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).send('Category with the given ID was not found.');

    if (description) category.description = description;
    if (videoLink) category.videoLink = videoLink;
    if (imageGallery) category.imageGallery = imageGallery;

    await category.save();
    res.send(category);

  } catch (err) {
    res.status(500).send("Error updating category: " + err.message);
  }
});


// Related Products
router.get('/categoryProducts/:categoryId', async (req, res) => {
  try {
    let categoryId = req.params.categoryId;
    const isEncrypted = req.query.isEncrypted === 'true'; // check if ID is encrypted from query parameter

    // if ID is encrypted, decrypt it first
    if (isEncrypted) {
      const decryptedIdObject = JSON.parse(categoryId);
      categoryId = cryptoUtils.decrypt(decryptedIdObject);
    }

    const category = await Category.findById(categoryId).populate('products');
    if (!category) return res.status(404).send('Category not found.');

    res.json(category.products);
  } catch (err) {
    res.status(500).send('Server error.');
  }
});


// Old route before Pagination
// router.get('/catDataFront', async (req, res) => {
//   try {
//     const idObject = JSON.parse(req.query.id);
//     decryptedRetId = cryptoUtils.decrypt(idObject);

//     // First, find the retailer using the decrypted ID
//     const retailer = await Retailer.findOne({ _id: decryptedRetId, isActivated: true });
//     if (!retailer) {
//       console.log("not found retailer")
//       return res.status(404).json({  msg: 'Retailer not found or not activated' });
//     }

//     // Find all categories that are associated with this retailer and not in the restrictedRetailers list
//     const categories = await Category.find({ 
//       parent: null, 
//       retailerId: retailer._id, 
//       restrictedRetailers: { $ne: retailer._id }
//     });

//     if (categories.length === 0) {
//       console.log("no Cateogries found")
//       return res.status(404).json({ msg: 'No categories found for this retailer' });
//     }

//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50))); // pass in the maximum depth you want to populate
//     console.log(populatedCategories,"populatedCategories")
//     res.json(populatedCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// Old route before restriction and ret id implementation
// router.get('/catData', async (req, res) => {
//   try {
//     const id = req.query.id;
//     decryptedRetId = cryptoUtils.decrypt(id);
//     console.log(id)
//     const categories = await Category.find({ parent: null });
//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50))); // pass in the maximum depth you want to populate
//     res.json(populatedCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// async function populateChildrencatData(category, depth) {
//   if (depth <= 0 || !category.children) {
//     return { _id: category._id, name: category.name, image: category.image };
//   }
//   const populatedChildren = await Category.populate(category, { path: 'children', select: '_id name children image' });
//   const populatedGrandChildren = await Promise.all(populatedChildren.children.map(child => populateChildrencatData(child, depth - 1)));
//   const children = populatedGrandChildren.map(child => ({ _id: child._id, name: child.name, children: child.children, image: child.image }));
//   return { _id: populatedChildren._id, name: populatedChildren.name, children, image: populatedChildren.image };
// }

// // get _id, name and image of the category for displaying in the dropdown menu
// router.get('/catData', async (req, res) => {
//   try {
//     const categories = await Category.find({parent:null },'_id name children image');
//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50))); // pass in the maximum depth you want to populate
//     res.json(populatedCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// async function populateChildrencatData(category, depth) {
//   if (depth <= 0 || !category.children) {
//     return { _id: category._id, name: category.name };
//   }
//   const populatedChildren = await Category.populate(category, { path: 'children', select: '_id name children' });
//   const populatedGrandChildren = await Promise.all(populatedChildren.children.map(child => populateChildrencatData(child, depth - 1)));
//   const children = populatedGrandChildren.map(child => ({ _id: child._id, name: child.name, children: child.children }));
//   return { _id: populatedChildren._id, name: populatedChildren.name, children };
// }


// // get _id and name of the category for displaying in the dropdown menu
// router.get('/catData', async (req, res) => {
//   try {
//     const categories = await Category.find({parent:null },'_id name children image');
//     const populatedCategories = await Promise.all(categories.map(category => populateChildrencatData(category, 50))); // pass in the maximum depth you want to populate
//     res.json(populatedCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// Get products in specific category
router.get('/:id/products', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId).populate('products');
    const products = category.products;
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// Update Category Data

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin, isRetailer } = req.user; // Extract user details from the decoded token
    const { error } = categoryValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is a retailer and if the category belongs to them
    if (isRetailer) {
      const category = await Category.findById(id);
      if (!category) return res.status(404).send('Category not found');
      if (category.retailerId.toString() !== _id.toString()) {
        return res.status(403).send('Access denied. Retailer does not have permission to update this category.');
      }
    }

    const updatedCategory = req.body;

    if (updatedCategory.parent) {
      const currentCategory = await Category.findById(id);
      if (!currentCategory) {
        return res.status(404).send('Category not found');
      }

      await Category.findByIdAndUpdate(currentCategory.parent, { $pull: { children: id } });

      const newParent = updatedCategory.parent ? await Category.findById(updatedCategory.parent) : null;
      if (newParent) {
        newParent.children.addToSet(id);
        await newParent.save();
      }

      currentCategory.set(updatedCategory);
      const result = await currentCategory.save();
      res.status(200).send(result);
    } else {
      const result = await Category.findByIdAndUpdate(id, updatedCategory, { new: true });
      if (!result) {
        return res.status(404).send('Category not found');
      }
      res.status(200).send(result);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error } = categoryValidator(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     // req.body.urlslug = slugify(req.body.urlslug, {
//     //   lower: true, // convert to lower case
//     //   remove: /[*+~.()'"!:@]/g, // remove special characters
//     //   strict: true // strip any special characters or non-Latin letters
//     // });
//     const updatedCategory = req.body;
//     console.log(updatedCategory.parent, "updatedCategory.parent")
//     console.log(id, "id")

//     if (updatedCategory.parent) {
//       console.log(updatedCategory.parent);
//       // Find the current category by ID
//       const currentCategory = await Category.findById(id);
//       if (!currentCategory) {
//         return res.status(404).send('Category not found');
//       }
//       // if(currentCategory.parent == updatedCategory.parent){
//       //   return res.status(404).send("Action not Possible due to the Same Parent")
//       // }
//       // Update the current parent's children array
//       await Category.findByIdAndUpdate(currentCategory.parent, { $pull: { children: id } });
//       console.log(currentCategory, "category")
//       // Find the new parent category by ID
//       const newParent = updatedCategory.parent ? await Category.findById(updatedCategory.parent) : null;
//       // If the new parent is not null or undefined
//       if (newParent) {
//         // Update the new parent's children array
//         newParent.children.addToSet(id);
//         await newParent.save();
//       }
//       // Update the category data and save changes
//       currentCategory.set(updatedCategory);
//       const result = await currentCategory.save();
//       res.status(200).send(result);
//     } else {
//       // Find the category by ID and update its data
//       const result = await Category.findByIdAndUpdate(id, updatedCategory, { new: true });
//       if (!result) {
//         return res.status(404).send('Category not found');
//       }
//       res.status(200).send(result);
//     }

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });





// Define the route handler for adding a new category
router.post("/", auth, async (req, res) => {  // Added the 'auth' middleware
  try {
    const { error } = categoryValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { _id, isAdmin, isRetailer } = req.user;  // Extract user details from the decoded token

    const { parent } = req.body;

    // If the user is an admin, they can create any category without restrictions
    if (isAdmin) {
      // Continue with the existing logic
    }
    // If the user is a retailer, they can only create categories associated with their retailer ID
    else if (isRetailer) {
      req.body.retailerId = _id;  // Set the retailerId to the current user's ID
    } else {
      return res.status(403).send('Access denied. Invalid user role.');
    }

    if (!parent) {
      delete req.body.parent;
      const newCategory = new Category({
        ...req.body,
        children: [],
        products: [],
        retailerId: req.body.retailerId || null  // Use provided retailerId or set to null
      });
      const savedCategory = await newCategory.save();
      res.status(200).send(savedCategory);
    } else {
      const newCategory = new Category({
        ...req.body,
        children: [],
        products: []
      });
      const savedCategory = await newCategory.save();
      await Category.updateOne({ _id: savedCategory.parent }, { $push: { children: savedCategory._id } });
      res.status(200).send(savedCategory);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const { error } = categoryValidator(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const { parent, retailerId } = req.body;

//     if (!parent) {
//       delete req.body.parent;
//       const newCategory = new Category({
//         ...req.body,
//         children: [],
//         products: [],
//         retailerId: retailerId || null  // Use provided retailerId or set to null
//       });
//       const savedCategory = await newCategory.save();
//       res.status(200).send(savedCategory);
//     } else {
//       const newCategory = new Category({
//         ...req.body,
//         children: [],
//         products: []
//       });
//       const savedCategory = await newCategory.save();
//       await Category.updateOne({ _id: savedCategory.parent }, { $push: { children: savedCategory._id } });
//       res.status(200).send(savedCategory);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });





// Delete Category Data

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin, isRetailer } = req.user; // Extract user details from the decoded token

    // Find the category to delete
    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).send('Category not found');
    }

    // If the user is an admin, they can delete any category
    if (isAdmin) {
      // Proceed to delete without any further checks
    }
    // If the user is a retailer, check if the category belongs to them
    else if (isRetailer) {
      if (categoryToDelete.retailerId.toString() !== _id.toString()) {
        return res.status(403).send('Access denied. Retailer does not have permission to delete this category.');
      }
    } else {
      // If the user is neither an admin nor a retailer
      return res.status(403).send('Access denied.');
    }

    // Remove the category from all of its parent categories' children arrays
    const parentCategories = await Category.find({ children: id });
    for (const parentCategory of parentCategories) {
      await Category.findByIdAndUpdate(parentCategory._id, { $pull: { children: id } });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);
    res.status(200).send('Category deleted successfully');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the category to delete
//     const categoryToDelete = await Category.findById(id);
//     if (!categoryToDelete) {
//       return res.status(404).send('Category not found');
//     }

//     // Remove the category from all of its parent categories' children arrays
//     const parentCategories = await Category.find({ children: id });
//     for (const parentCategory of parentCategories) {
//       await Category.findByIdAndUpdate(parentCategory._id, { $pull: { children: id } });
//     }

//     // Delete the category
//     await Category.findByIdAndDelete(id);
//     res.status(200).send('Category deleted successfully');

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// Post Sub Category
// router.post('/:parentId/subcategories', async (req, res) => {
//   try {
//     const { parentId } = req.params;
//     // Find the parent category and create a new subcategory object
//     const parentCategory = await Category.findById(parentId);
//     const subcategory = new Category({...req.body,parent: parentCategory._id,});

//     // Save the new subcategory to the database
//     const savedSubcategory = await subcategory.save();

//     // Add the new subcategory's ID to the parent category's children array
//     parentCategory.children.push(savedSubcategory._id);
//     await parentCategory.save();
//     res.status(201).send(savedSubcategory);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });




// This code is for Extracting the Data of categories in

// function extractNames(category, parentName = "") {
//   const name = category.name;
//   const fullName = parentName ? parentName + " > " + name : name;

//   if (category.children.length === 0) {
//     return [fullName];
//   } else {
//     const childrenNames = category.children.flatMap(child => extractNames(child, fullName));
//     return [fullName, ...childrenNames];
//   }
// }

// function flatten(arr) {
//   return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
// }

// router.get('/getChildrens', async (req, res) => {
//   try {
//     async function populateChildren(category) {
//       const populatedCategory = await Category
//         .findById(category._id)
//         .populate({
//           path: 'children',
//           select: 'name'
//         })
//         .select('name children')
//         .exec();

//       if (populatedCategory.children.length) {
//         populatedCategory.children = await Promise.all(
//           populatedCategory.children.map(child => populateChildren(child))
//         );
//       }

//       return populatedCategory;
//     }
//     const category = await Category.findById("64363949bac79d22ba49de51");
//     const populatedCategory = await populateChildren(category);
//     console.log(populatedCategory);
//    const data =  extractNames(populatedCategory)
//   //  const resultantData = flatten(data)
//     res.json(data);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });




// Working fine
// function getChildrenData(data) {
//   const result = [];

//   function traverse(node, path) {
//     const newPath = [...path, node.name];

//     if (node.parent) {
//       traverse(node.parent, newPath);
//     } else {
//       result.push(newPath.reverse().join(" > "));
//     }

//     if ((node.children && node.children.length > 0) ) {
//       for (const child of node.children) {
//         traverse(child, newPath);
//       }
//     }
//   }

//   for (const node of data) {
//     traverse(node, []);
//   }

//   return result;
// }


// router.get('/getChildrens', async (req, res) => {
//   try {
//     const categories = await Category.find()
//       .populate({
//         path: 'parent',
//         select: '_id name',
//       })
//       .populate({
//         path: 'children',
//         select: '_id name',
//       })
//       .select('_id name parent children');

//       // const result = getChildrenData(categories)

//     res.json(categories);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Old Code
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedCategory = req.body;
//     // Find the category by ID and update its data
//     const result = await Category.findByIdAndUpdate(id, updatedCategory, { new: true });
//     if (!result) {
//       return res.status(404).send('Category not found');
//     }
//     res.status(200).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// // Update SubCategory Data
// router.put('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
//   const { categoryId, subcategoryId } = req.params;
//   const { name } = req.body;
//   try {
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     const subCategory = category.subCategories.id(subcategoryId);
//     if (!subCategory) {
//       return res.status(404).json({ message: 'Subcategory not found' });
//     }

//     subCategory.name = name;
//     await category.save();

//     res.status(200).json({ message: `Subcategory '${subcategoryId}' updated with name '${name}' in category '${category.name}'` });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

//   // Update subCategory data
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const category = await Category.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { new: true }
//     );
//     if (!category) {
//       return res.status(404).send('Category not found');
//     }
//     res.status(200).json(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// });


// The code below is for creating the string path

// router.get('/categories', async (req, res) => {
//   try {
//     const categories = await Category.find().populate('children');
//     const categoryStrings = [];

//     for (const category of categories) {
//       let categoryString = category.name;

//       // Check if the category has a parent
//       if (category.parent) {
//         let parent = await Category.findById(category.parent);
//         // If the parent exists, add it to the category string
//         if (parent) {
//           categoryString = `${parent.name} > ${categoryString}`;
//         }
//       }

//       // If the category has children, add them to the category string
//       if (category.children.length > 0) {
//         categoryString += ` > ${category.children.map(child => child.name).join(' > ')}`;
//       }

//       categoryStrings.push(categoryString);
//     }

//     res.json(categoryStrings);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });





// // Define a recursive function to generate the category path string
// async function getCategoryPathString(category) {
//   // Base case: if category has no parent, return category name
//   if (!category.parent) {
//     return category.name;
//   }

//   // Otherwise, get the parent category and append the current category name
//   const parentCategory = await Category.findById(category.parent);
//   const parentCategoryPath = await getCategoryPathString(parentCategory);
//   return `${parentCategoryPath} > ${category.name}`;
// }

// // Define the route to return the category paths
// router.get("/categoriesString", async (req, res) => {
//   try {
//     // Find all the top-level categories (categories with no parent)
//     const topLevelCategories = await Category.find({ parent: { $exists: false } });

//     // Generate the category path string for each top-level category and its children
//     const categoryPaths = [];
//     for (const category of topLevelCategories) {
//       categoryPaths.push(await getCategoryPathString(category));
//       for (const childId of category.children) {
//         const childCategory = await Category.findById(childId);
//         categoryPaths.push(await getCategoryPathString(childCategory));
//       }
//     }

//     // Return the category path strings
//     res.status(200).json(categoryPaths);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });







module.exports = router;
const express = require("express");
const router = express.Router();
const { subCategoryValidator,subCategory } = require('../models/subCategory')
const { Category } = require('../models/category')

// Add new SubCategory
router.post('/', async(req, res) => {
    const { error } = subCategoryValidator({name:req.body.name})
    if (error) return res.status(400).send(error.details[0].message)
    const {name,parentCategory} = req.body
    try {
      const parentCategoryData = await Category.findById(parentCategory);
      if (!parentCategoryData) {
          return res.status(404).send('Parent category not found');
      }
      const newSubCategory = new subCategory({name,parentCategory});
      const savedSubCategory = await newSubCategory.save();
      parentCategoryData.subCategories.push(savedSubCategory._id);
      await parentCategoryData.save();
      res.status(201).send(savedSubCategory);
    }catch(error){
      console.log(error.message)
        res.status(500).send("Server Error")
    }

})

// GET SubCategory Data from DB
router.get('/', async(req, res) => {
    const subCategoryData = await subCategory.find({})
    if (subCategoryData.length < 1) return res.send("Sorry There are no Categories Available right Now!")
    res.status(200).send(subCategoryData)
})

// Delete SubCategory Data
  router.delete('/', async (req, res) => {
    try {
      const {id} = req.body
      const subCategoryData = await subCategory.deleteMany({_id:id});
      if (!subCategoryData) {
        return res.status(404).send('Category not found');
      }
      res.send('Category successfully Deleted');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

// Update SubCategory Data

router.put('/:id', async(req, res) => {
    try{
        const { error } = subCategoryValidator(req.body)
        if (error) return res.status(400).send(error.details[0].message);
        const id = req.params.id;
        const {name} = req.body
        const subCategoryData = await subCategory.findByIdAndUpdate(id,{name}, { new: true });
        res.send(subCategoryData)
    }catch(error){
        console.error(err);
        res.status(500).send('Server Error');    
    }
})



module.exports = router;
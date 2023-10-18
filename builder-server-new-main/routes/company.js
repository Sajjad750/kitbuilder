const express = require("express");
const router = express.Router();
const { companyValidator,Company } = require('../models/company')



// Add new Company
router.post('/', async(req, res) => {
    const { error } = companyValidator(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const {name,email,logo,phone,websiteurl} = req.body

    let company = await Company.findOne({ name });
    if (company) return res.status(400).send('Company already registered.');
    try{
        const companyData = new Company({name,email,logo,phone,websiteurl});
        await companyData.save();
        res.status(200).send(companyData);
    }catch(error){
        res.status(500).send("Server Error")
    }
})

// GET Company Data from DB
router.get('/', async(req, res) => {
    const companyData = await Company.find({})
    if (companyData.length < 1) return res.send("Sorry There are no Companies Available right Now!")
    res.status(200).send(companyData)
})

// Delete Company Data
  router.delete('/', async (req, res) => {
    try {
      const {id} = req.body
      const companyData = await Company.deleteMany({_id:id});
      if (!companyData) {
        return res.status(404).send('Company not found');
      }
      res.send('Company successfully Deleted');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

// Update Company Data

router.put('/:id', async(req, res) => {
    try{
        const { error } = companyValidator(req.body)
        if (error) return res.status(400).send(error.details[0].message);
        const id = req.params.id;
        const {name,email,phone,logo,websiteurl} = req.body
        // const updates = req.body
        // // Find the company by ID and update the data
        const company = await Company.findByIdAndUpdate(id,{name,email,phone,logo,websiteurl}, { new: true });
        res.send(company)
    }catch(error){
        console.error(err);
        res.status(500).send('Server Error');    
    }
})



module.exports = router;
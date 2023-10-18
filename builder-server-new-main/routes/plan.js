const express = require("express");
const router = express.Router();
const {Plan,planValidator} = require('../models/plan')
const nodemailer = require('nodemailer');

// Add Plan in DB
router.post('/', async(req, res) => {
    const {name,price,duration,features} = req.body
    const { error } = planValidator(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let planData = await Plan.findOne({ name });
    if (planData) return res.status(400).send('Plan already Present in Database.');
    try{
        const PlanData = new Plan({name,price,duration,features});
        await PlanData.save();
        res.status(200).send(PlanData);
    }catch(error){
        res.status(500).send("Server Error")
    }

})

// // GET Subscribers Data from DB
router.get('/', async(req, res) => {
    const planData = await Plan.find({})
    if (planData.length < 1) return res.send("Sorry There are no Plans Available right Now!")
    res.status(200).send(planData)
})


  // DELETE Subscriber by email

  router.delete('/', async (req, res) => {
    try {
      const {id} = req.body
      const planData = await Plan.deleteMany({_id:id});
      if (!planData) {
        return res.status(404).send('Plan not found');
      }
      res.send('Plan successfully Deleted');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
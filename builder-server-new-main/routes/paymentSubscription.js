const express = require("express");
const router = express.Router();
const { subscriptionValidator,Subscription} = require('../models/paymentSubscription')

// Add Payment in DB
router.post('/', async(req, res) => {
    const {email,retailer,plan,payment_method,payment_status} = req.body
    const { error } = subscriptionValidator({email,payment_method})
    if (error) return res.status(400).send(error.details[0].message)

    let subscriber = await Subscription.findOne({ email });
    if (subscriber) return res.status(400).send('User has already Subscribed.');
    try{
      // ,end_date
        const subscriberData = new Subscription({email,payment_method,payment_status,retailer,plan});
        await subscriberData.save();
        res.status(200).send(subscriberData);
    }catch(error){
        res.status(500).send("Server Error")
    }

})

// // GET Subscribers Data from DB
router.get('/', async(req, res) => {
    // .populate('retailer plan');
    const subscriberData = await Subscription.find({})
    if (subscriberData.length < 1) return res.send("Sorry There are no Subscribers Available right Now!")
    res.status(200).send(subscriberData)
})


  // DELETE Subscriber by email

  router.delete('/', async (req, res) => {
    try {
      const {email} = req.body
      const subscriberData = await Subscription.deleteMany({email});
      if (!subscriberData) {
        return res.status(404).send('Subscriber not found');
      }
      res.send('UnSubscribed successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});



module.exports = router;
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {Admin} = require('../models/admin');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let admin = await Admin.findOne({ email: req.body.email });
  console.log(admin,"admin")
  if (!admin) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = admin.generateAuthToken()
  res.send(token);
});

const validate = (admin) => {

  const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
  return schema.validate(admin)

}


// This is for backend since the code from auth file is changed to latest version
// const Joi = require('joi');
// const bcrypt = require('bcrypt');
// const {Admin} = require('../models/admin');
// const {Retailer} = require('../models/retailer');
// const express = require('express');
// const router = express.Router();


// router.post('/', async (req, res) => {
//   const { error } = validate(req.body); 
//   console.log(req.body.email,"email")
//   console.log(req.body.password,"pass")

//   if (error) return res.status(400).send(error.details[0].message);

//   let admin = await Admin.findOne({ email: req.body.email });
//   if (!admin) return res.status(400).send('Invalid email or password.');

//   const validPassword = await bcrypt.compare(req.body.password, admin.password);
//   if (!validPassword) return res.status(400).send('Invalid email or password.');

//   const token = admin.generateAuthToken()
//   res.send(token);
// });

// const validate = (admin) => {
//   const schema = Joi.object({
//       email: Joi.string().min(5).max(255).required().email(),
//       password: Joi.string().min(5).max(255).required()
//     });
//   return schema.validate(admin)
// }

// router.post('/retailer', async (req, res) => {
//   const { error } = validateRetailer(req.body); 
//   if (error) return res.status(400).send(error.details[0].message);

//   let retailer = await Retailer.findOne({ email: req.body.email });
//   if (!retailer) return res.status(400).send('Invalid email or password.');

//   const validPassword = await bcrypt.compare(req.body.password, retailer.password);
//   if (!validPassword) return res.status(400).send('Invalid email or password.');

//   const token = retailer.generateAuthToken()
//   res.send(token);
// });

// const validateRetailer = (retailer) => {
//   const schema = Joi.object({
//       email: Joi.string().min(5).max(255).required().email(),
//       password: Joi.string().min(5).max(255).required()
//     });
//   return schema.validate(retailer)

// }

// module.exports = router; 



module.exports = router; 

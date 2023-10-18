const express = require("express");
const router = express.Router();
const { retailerValidator,Retailer } = require('../models/retailer')
const {passwordValidator} = require('../helperFunctions/passwordValidator')
const { distributorValidator,Distributor } = require('../models/distributor')
const MongoIdValidator = require('../helperFunctions/ObjectId_Validator')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth')
const openAuth = require('../middleware/openAuth')
const {Category} = require('../models/category')


// Add new Retailer
router.post('/', async(req, res) => {
    // const { error } = retailerValidator(req.body)
    // if (error) return res.status(400).send(error.details[0].message)
    const {name,email,password} = req.body
    // console.log(req.body)

    let retailer = await Retailer.findOne({ email: email });
    if (retailer) return res.status(400).send('Retailer already registered.');
    try{
        const retailerData = new Retailer(req.body);
        const salt = await bcrypt.genSalt(10);
        retailerData.password = await bcrypt.hash(retailerData.password, salt);
        await retailerData.save();
        res.status(200).send(retailerData);
      } catch (error) {
        console.error("Error details:", error);
        res.status(500).send("Server Error");
    }
})


router.post('/getretailerquote', async (req, res) => {

  // Destructure the required fields from req.body
  const { name, email, logo, domains,phone } = req.body;

  // Check if the retailer with the given email already exists
  let retailer = await Retailer.findOne({ email: email });
  if (retailer) return res.status(400).send('Retailer already registered.');

  try {
    // console.log(domains,"domain")
      // Create a new retailer with the provided data
      const retailerData = new Retailer({
        name: name,
        email: email,
        logo: logo,
        domains: [domains],  // Wrap the domain in an array
        phone:phone
    });
      // Save the retailer data
      await retailerData.save();

      // Retrieve the latest retailer that was just stored
      const latestRetailer = await Retailer.findOne({ email: email });

      // Encrypt the retailer's MongoDB ID using bcrypt and store it in the password field
      const salt = await bcrypt.genSalt(10);
      latestRetailer.password = await bcrypt.hash(latestRetailer._id.toString(), salt);
      latestRetailer.distributionId = latestRetailer._id
      await latestRetailer.save();

      res.status(200).send(latestRetailer);

  } catch (error) {
      console.error("Error details:", error);
      res.status(500).send("Server Error");
  }
});


// GET Retailer Data from DB
router.get('/notActivated', async(req, res) => {
  try{
    const retailerData = await Retailer.find({isActivated:false})
    if (retailerData.length < 1) return res.send("Sorry There are no Non Activated Retailers Available right Now!")
    res.status(200).send(retailerData)
  }catch(error){
    console.log(error)
  }
})

// Get Disabled Retailers

router.get('/ActivatedAndDisabled', async(req, res) => {
  try{
    const retailerData = await Retailer.find({
      $and: [
        {isActivated: true},
        {isDisabled: true}
      ]
    })
    if (retailerData.length < 1) return res.send("Sorry, there are no Activated and disabled retailers available right now!")
    res.status(200).send(retailerData)
  }catch(error){
    console.log(error)
  }
})

router.put('/ActivatedAndDisabled/:id', async(req, res) => {
  try{
    const { isDisabled } = req.body;
    // console.log(isDisabled,"isDisabled")
    const { id } = req.params;
    // console.log(id,"id")

    // Check if isDisabled field is provided and is a boolean
    if (isDisabled === undefined || typeof isDisabled !== 'boolean') {
      return res.status(400).send('Invalid request: isDisabled is required and should be a boolean.');
    }
    // Find the retailer and update
    const retailer = await Retailer.findByIdAndUpdate(
      id,
      { $set: { isDisabled: isDisabled } },
      { new: true }
    );
    // If retailer not found, send appropriate response
    if (!retailer) {
      return res.status(404).send('Retailer with given ID not found.');
    }
    res.status(200).send(retailer);
  } catch(error) {
    console.log(error);
    res.status(500).send('An error occurred while trying to update the retailer.');
  }
})



// Get Activated and Not Disabled Retailers
router.get('/ActivatedAndNotDisabled', async(req, res) => {
  try {
    const retailerData = await Retailer.find({
      $and: [
        {isActivated: true},
        {isDisabled: false}
      ]
    })
    if (retailerData.length < 1) return res.send("Sorry, there are no activated and not disabled retailers available right now!")
    res.status(200).send(retailerData)
  }catch(error){
    console.log(error)
  }
})

// Update Retailer's Activation Status
router.put('/ActivatedAndNotDisabled/:id', async(req, res) => {
  try {
    const { isActivated } = req.body;
    const { id } = req.params;

    // Check if isActivated field is provided and is a boolean
    if (isActivated === undefined || typeof isActivated !== 'boolean') {
      return res.status(400).send('Invalid request: isActivated is required and should be a boolean.');
    }
    // Find the retailer and update
    const retailer = await Retailer.findByIdAndUpdate(
      id,
      { $set: { isActivated: isActivated } },
      { new: true }
    );
    // If retailer not found, send appropriate response
    if (!retailer) {
      return res.status(404).send('Retailer with given ID not found.');
    }
    res.status(200).send(retailer);
  } catch(error) {
    console.log(error);
    res.status(500).send('An error occurred while trying to update the retailer.');
  }
})



// GET Retailer Data from DB
router.get('/',auth,async(req, res) => {
    const retailerData = await Retailer.find({isActivated:true})
    if (retailerData.length < 1) return res.send("Sorry There are no Retailers Available right Now!")
    res.status(200).send(retailerData)
})

// GET current Retailer Data
router.get('/:id', async(req, res) => {
  const id = req.params.id
  const retailerData = await Retailer.find({_id:id})
  if (retailerData.length < 1) return res.send("Sorry There are no Retailer Available right Now!")
  res.status(200).send(retailerData)
})


// Route for password reset request
  router.post('/forgot', async (req, res, next) => {
    try {
        const {email} = req.body
      // Generate a unique token for verification
      const token = crypto.randomBytes(20).toString('hex');
  
      // Find the user by email
      const retailerData = await Retailer.findOne({ email });
      if (!retailerData) {
        return res.status(404).send('Retailer not found');
      }
  
      // Save the token to the user's account
      retailerData.resetToken = token;
      retailerData.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
      await retailerData.save();
  
      // Send an email to the user with the reset link
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kitbuildert101@gmail.com',
            pass: "juyyjeupnuvsinoa"
        }
      });
      const mailOptions = {
        to: adminData.email,
        from: 'BaronTech-KitBuilder',
        subject: 'Password Reset Request',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${req.protocol}://${req.headers.host}/api/admin/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        console.log(`Message sent: ${info.response}`);
        res.status(200).send('An email has been sent to your account');
      });
    } catch (err) {
      next(err);
    }
  });
  



  //   Reset Password
  router.post('/resetpassword/:token', async (req, res) => {
    const token = req.params.token
    const { password } = req.body;
  
    // Validate request body
    const { error } = passwordValidator({password});
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    try {
      // Find admin with matching generated token
      const retailer = await Retailer.findOne({resetToken:token});
      if (!retailer) {
        return res.status(400).send('Invalid reset token.');
      }
  
      // Check if reset token has expired
      if (Date.now() > retailer.resetTokenExpires) {
        return res.status(400).send('Reset token has expired.');
      }
  
      // Hash new password and save to database
      const salt = await bcrypt.genSalt(10);
      retailer.password = await bcrypt.hash(password, salt);
      retailer.resetToken = null;
      retailer.resetTokenExpires = null;
      await retailer.save();
  
      return res.status(200).send('Password reset successful.');
    } catch (err) {
      console.error(err);
      return res.status(500).send('An error occurred while resetting password.');
    }
  });


  router.post('/addDistributor/:id',openAuth, async(req, res) => {
      try{
        const { error } = distributorValidator(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const id = req.params.id
        const { iderror } = MongoIdValidator(id)
        if (iderror) return res.status(400).send(iderror.details[0].message)
        const existingDistributor = await Distributor.findOne({ email: req.body.email, retailerId: id })
        if (existingDistributor)  return res.status(400).send('A distributor with this email already exists for this retailer')
      
        const distributorData = new Distributor({...req.body,retailerId:id});
        await distributorData.save();
        res.status(200).send(distributorData);
      }catch(error){
        console.log(error)
        return res.status(500).send('An error occurred while registration of Distributor.');
      }
  })

  // GET current Distributor Data
  router.get('/getDistributors/:id',openAuth,async(req, res) => {
    const retailerId = req.params.id
    const distributorData = await Distributor.find({ retailerId })
    if (distributorData.length < 1) return res.send("Sorry There are no Distributors Available right Now!")
    res.status(200).send(distributorData)
  })

  // GET current Distributor Data
  router.get('/getSpecificDistributor/:id', openAuth,async(req, res) => {
    try{
      const id = req.params.id
      const distributorData = await Distributor.find({_id:id})
      if (distributorData.length < 1) return res.send("Sorry There are no Distributors Available right Now!")
      res.status(200).send(distributorData)
    }catch(error){
      console.log(error)
      return res.status(500).send('An error occurred while getting info of specific Distributor.');
    }

  })


  // PUT request to update distributor status
  router.put('/updateDistributorStatus/:id',openAuth ,async (req, res) => {
    try {
      const id = req.params.id;
      const { isActive } = req.body;
      const distributor = await Distributor.findById(id);
      if (!distributor) return res.status(404).send('Distributor not found');
      distributor.isActive = isActive;
      await distributor.save();
      res.status(200).send(distributor);
    } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while updating distributor status');
    }
  });


  // PUT request to update distributor status
  router.put('/updateDistributorStatus/:id',openAuth ,async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const distributor = await Distributor.findById(id);
      if (!distributor) return res.status(404).send('Distributor not found');
      distributor.isActive = status;
      await distributor.save();
      res.status(200).send(distributor);
    } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while updating distributor status');
    }
  });


  // Update Distributer Data
  router.put('/updateDistributor/:id',openAuth, async(req, res) => {
    try {
      const id = req.params.id;
      const { iderror } = MongoIdValidator(id);
      if (iderror) return res.status(400).send(iderror.details[0].message);
      const update = req.body;
      const { error } = distributorValidator(update);
      if (error) return res.status(400).send(error.details[0].message);
      const distributorData = await Distributor.findByIdAndUpdate(
        id,
        {
          $set: {
            ...update,
          },
        },
        { new: true }
      );
      res.status(200).send(distributorData);
    } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while updating Distributor.');
    }
  })

  router.delete('/deleteDistributor/:id',openAuth ,async(req, res) => {
    try {
      const id = req.params.id;
      const { error } = MongoIdValidator(id);
      if (error) return res.status(400).send(error.details[0].message);
      const deletedDistributor = await Distributor.findByIdAndDelete(id);
      if (!deletedDistributor) return res.status(404).send("Distributor not found");
      res.status(200).send("Distributor deleted successfully");
    } catch (error) {
      console.log(error);
      return res.status(500).send("An error occurred while deleting the distributor");
    }
  })


  // Color Kit Pallets Routes

  router.post('/addColors/:retailerId', async (req, res) => {
    try {
      const retailer = await Retailer.findById(req.params.retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      const { colors } = req.body;
      if (!Array.isArray(colors)) return res.status(400).send('Colors must be an array.');
  
      retailer.colorPalette.push(...colors);
      await retailer.save();
  
      res.send('Colors added successfully.');
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });
  

  router.delete('/deleteColor/:retailerId', async (req, res) => {
    try {
      const retailer = await Retailer.findById(req.params.retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      const { color } = req.body;
      const colorIndex = retailer.colorPalette.indexOf(color);
      if (colorIndex !== -1) {
        retailer.colorPalette.splice(colorIndex, 1);
        await retailer.save();
        res.send('Color deleted successfully.');
      } else {
        res.status(404).send('Color not found in palette.');
      }
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });


  router.get('/getColorPalette/:retailerId', async (req, res) => {
    try {
      let retailerId = req.params.retailerId;
      const isEncrypted = req.query.isEncrypted === 'true'; // check if ID is encrypted from query parameter
  
      // if ID is encrypted, decrypt it first
      if (isEncrypted) {
        const decryptedIdObject = JSON.parse(retailerId);
        retailerId = cryptoUtils.decrypt(decryptedIdObject);
      }
  
      const retailer = await Retailer.findById(retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      res.json(retailer.colorPalette);
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });
  

  router.put('/updateColor/:retailerId', async (req, res) => {
    try {
      const retailer = await Retailer.findById(req.params.retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      const { oldColor, newColor } = req.body;
      const colorIndex = retailer.colorPalette.indexOf(oldColor);
      if (colorIndex !== -1) {
        retailer.colorPalette[colorIndex] = newColor;
        await retailer.save();
        res.send('Color updated successfully.');
      } else {
        res.status(404).send('Color not found in palette.');
      }
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });

  // Routes for Uploading Company logo

  router.post('/uploadLogo/:retailerId', async (req, res) => {
    try {
      const retailer = await Retailer.findById(req.params.retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      const { logo } = req.body;
      retailer.logo = logo;
      await retailer.save();
  
      res.send('Logo uploaded successfully.');
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });


  router.get('/getLogo/:retailerId', async (req, res) => {
    try {
      let retailerId = req.params.retailerId;
      const isEncrypted = req.query.isEncrypted === 'true'; // check if ID is encrypted from query parameter
  
      // if ID is encrypted, decrypt it first
      if (isEncrypted) {
        const decryptedIdObject = JSON.parse(retailerId);
        retailerId = cryptoUtils.decrypt(decryptedIdObject);
      }
  
      const retailer = await Retailer.findById(retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      res.json(retailer.logo);
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });
  

  router.put('/updateLogo/:retailerId', async (req, res) => {
    try {
      const retailer = await Retailer.findById(req.params.retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      const { logo } = req.body;
      retailer.logo = logo;
      await retailer.save();
      res.send('Logo updated successfully.');
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });

  
  router.delete('/deleteLogo/:retailerId', async (req, res) => {
    try {
      const retailer = await Retailer.findById(req.params.retailerId);
      if (!retailer) return res.status(404).send('Retailer not found.');
  
      retailer.logo = null;
      await retailer.save();
      res.send('Logo deleted successfully.');
    } catch (err) {
      res.status(500).send('Server error.');
    }
  });
  
  



module.exports = router;
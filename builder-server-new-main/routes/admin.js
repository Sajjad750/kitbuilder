const express = require("express");
const router = express.Router();
const { adminValidator, Admin } = require('../models/admin')
const { Retailer } = require('../models/retailer')
const { Product } = require('../models/product')
const { Quote } = require('../models/quote')
const { Category } = require('../models/category')
const { passwordValidator } = require('../helperFunctions/passwordValidator')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth')
const openAuth = require('../middleware/openAuth')
const axios = require('axios')
const mongoose = require('mongoose');
const cryptoUtils = require('../helperFunctions/cryptoUtils');
const validateToken = require('../middleware/validateToken')
const jwt = require('jsonwebtoken');
const config = require('config')
const _ = require('lodash');
// Add new Admin

router.post('/', async (req, res) => {
  const { name, email, password, phone } = req.body
  const { error } = adminValidator({ name, email, password, phone })
  if (error) return res.status(400).send(error.details[0].message)

  let admin = await Admin.findOne({ isAdmin: true });
  if (admin) return res.status(400).send('Admin already registered.');
  try {
    const adminData = new Admin({ name, email, password, phone });
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);
    await adminData.save();
    res.status(200).send(adminData);
  } catch (error) {
    res.status(500).send("Server Error")
  }
})

router.post('/brcyptpass', async (req, res) => {
  const { password } = req.body
  try {
    const salt = await bcrypt.genSalt(10);
    const genPass = await bcrypt.hash(password, salt);
    res.status(200).send(genPass);
  } catch (error) {
    res.status(500).send("Server Error")
  }
})

// Loading File

router.get('/load-js', async (req, res) => {
  try {
    console.log("localserver targeted")
      const key = req.query.key;
      const referer = req.get('referer');
      // console.log(referer, "referer");

      // Check if referer is present
      if (!referer) {
          return res.status(400).send('Referer header is missing');
      }

      // Extract domain from referer
      let domain;
      try {
          domain = new URL(referer).hostname;
      } catch (error) {
          console.error("Error extracting domain from referer:", error);
          return res.status(400).send('Invalid referer');
      }
      // console.log(domain, "Extracted Domain");

      // Verify if the key is authentic
      if (!mongoose.Types.ObjectId.isValid(key)) {
          return res.status(400).send('Invalid retailer key');
      }

      const retailer = await Retailer.findById(key);

      // Check if retailer exists
      if (!retailer) {
          return res.status(404).send('Retailer not found');
      }

      // Check if retailer is active
      if (!retailer.isActivated) {
          return res.status(403).send('You are not allowed to use the script');
      }

      // Check if domain is allowed or if it's localhost
      // this code is commented for clients testing later on remove the comment 
      // if (!retailer.domains.includes(domain) && !domain.includes('localhost')) {
      //     return res.status(403).send('This domain is not allowed to use the script');
      // }

      const scriptLink = await mongoose.connection.collection('scriptlink').findOne({});

      if (!scriptLink || !scriptLink.link) {
          return res.status(404).send('No script link found');
      }

      // Get externalJSUrl from DB
      const externalJSUrl = scriptLink.link;

      // Encrypt the MongoID (key) and stringify it for storage in the cookie
      let encryptedKey = cryptoUtils.encrypt(key);
      let cookieValue = JSON.stringify(encryptedKey);

      // const cookieOptions = {
      //     path: '/'
      // };

    //   const cookieOptions = {
    //     path: '/',
    //     httpOnly: false,
    //     domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.domain.com'
    // };


      // Set the cookie here before sending the file
      // res.cookie('retId', cookieValue, cookieOptions);
      // res.cookie('retailerLogo', retailer.logo, cookieOptions);

      // Make a request to the external JS file URL using the Promise-based API
      axios.get(externalJSUrl)
      .then(response => {
          // Prepare JavaScript to set localStorage values
          let setLocalStorageScript = `
              localStorage.setItem('retId', '${cookieValue}');
              localStorage.setItem('retailerLogo', '${retailer.logo}');
          `;

          // Append the received external JS to the above script
          let combinedScript = setLocalStorageScript + response.data;
  
          // Set the response content type to JavaScript and send the combined JS in response
          res.setHeader('Content-Type', 'application/javascript');
          res.send(combinedScript);
      })
      .catch(error => {
          console.error(error);
          res.status(500).send('Error loading external JS file');
      });
  
  } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).send('Internal server error');
  }
});

// axios.get(externalJSUrl)
// .then(response => {
//     // Set the response content type to JavaScript and send the JS file in response
//     res.setHeader('Content-Type', 'application/javascript');
//     res.send(response.data);
// })
// .catch(error => {
//     console.error(error);
//     res.status(500).send('Error loading external JS file');
// });

  // const HostnameSchema = new mongoose.Schema({
  //   retailerId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Retailer',
  //     required: true
  //   },
  //   hostnames: {
  //     type: [String],
  //     default: []
  //   }
  // });

  // const Hostname = mongoose.model('Hostname', HostnameSchema);
  // // If the hostName is not already in the retailer's hostnames array, add it
  // // Check if there's already a hostname document for this retailer
  // let hostnameDoc = await Hostname.findOne({ retailerId: key });

  // // If no document exists, create one
  // if (!hostnameDoc) {
  //   hostnameDoc = new Hostname({
  //     retailerId: key,
  //     hostnames: []
  //   });
  // }


  // // If the hostName is not already in the hostnameDoc's hostnames array, add it
  // if (!hostnameDoc.hostnames.includes(domain)) {
  //   hostnameDoc.hostnames.push(domain);
  //   await hostnameDoc.save(); // Save the updated/created hostname document
  // }



// Without encryption and decryption

// router.get('/load-js', async (req, res) => {
//   const key = req.query.key;
//   // Verify if the key is authentic
//   if (!mongoose.Types.ObjectId.isValid(key)) {
//     return res.status(400).send('Invalid retailer key');
//   }

//   const retailer = await Retailer.findById(key);

//   // Check if retailer exists
//   if (!retailer) {
//     return res.status(404).send('Retailer not found');
//   }

//   // Check if retailer is active
//   if (!retailer.isActivated) {
//     return res.status(403).send('You are not allowed to use the script');
//   }

//   // Get hostname from request
//   const hostName = req.get('host');
//   console.log(hostName, "Host name")

//   // Check if domain is allowed or if it's localhost
//   // if (!retailer.domains.includes(hostName) && !hostName.includes('localhost')) {

//   if (!retailer.domains.includes(hostName) && !hostName.includes('localhost')) {
//     return res.status(403).send('This domain is not allowed to use the script');
//   }

//   const scriptLink = await mongoose.connection.collection('scriptlink').findOne({});

//   if (!scriptLink || !scriptLink.link) {
//     return res.status(404).send('No script link found');
//   }

//   // Get externalJSUrl from DB
//   const externalJSUrl = scriptLink.link;

//   // Make a request to the external JS file URL using the Promise-based API
//   axios.get(externalJSUrl)
//     .then(response => {
//       // Set the response content type to JavaScript and send the JS file in response
//       res.setHeader('Content-Type', 'application/javascript');
//       res.send(response.data);
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).send('Error loading external JS file');
//     });
// });


// router.get('/load-js', (req, res) => {
//   const key = req.query.key;
//   console.log(key, "this is key")
//   // verify if the key is authentic
//   if (key === '23434526') {
//     console.log("authenticated user")
//     console.log(req.headers.host, "Request host");
//     console.log(req.hostname, "Request hostname");
//     console.log(req.baseUrl, "Request baseUrl");
//     console.log(req.ip, "Request IP Address");

//     const externalJSUrl = "https://cdn.jsdelivr.net/gh/abdullah-live/kit-script-code/bundle.js";

//     // make a request to the external JS file URL using the Promise-based API
//     axios.get(externalJSUrl)
//       .then(response => {
//         // set the response content type to JavaScript and send the JS file in response
//         res.setHeader('Content-Type', 'application/javascript');
//         res.send(response.data);
//       })
//       .catch(error => {
//         console.error(error);
//         res.status(500).send('Error loading external JS file');
//       });
//   } else {
//     res.status(401).send('Unauthorized');
//   }
// });


// GET Admin Data from DB
router.get('/', auth, async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.isAdmin) {
      const adminData = await Admin.find({});
      if (adminData.length < 1) return res.send("Sorry, there are no admins available right now!");
      // Use lodash to pick only the desired fields
      const filteredAdminData = adminData.map(admin => _.pick(admin, ['_id', 'name', 'email','phone']));
      console.log(filteredAdminData,"filteredRetailerData")
      return res.status(200).send(filteredAdminData);
    }
    // If the user is a retailer
    if (req.user.isRetailer) {
      const retailerData = await Retailer.findById(req.user._id); // Assuming you have a Retailer model
      if (!retailerData) return res.send("Sorry, no data available for this retailer.");
      // Use lodash to pick only the desired fields
      const filteredRetailerData = _.pick(retailerData, ['_id', 'name', 'email',"phone"]);
      return res.status(200).send([filteredRetailerData]);
    }
    // If the user doesn't match any known roles
    res.status(400).send("Invalid user role.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Define a function to count the number of documents for each collection
// const getCounts = async () => {
//   const retailersCount = await Retailer.countDocuments();
//   const categoriesCount = await Category.countDocuments();
//   const productsCount = await Product.countDocuments();
//   const quotationsCount = await Quote.countDocuments();

//   return {
//     retailers: retailersCount,
//     categories: categoriesCount,
//     products: productsCount,
//     quotations: quotationsCount,
//   };
// };

const getCounts = async (userId, isAdmin, isRetailer) => {
  let retailersCount, categoriesCount, productsCount, quotationsCount;

  if (isAdmin) {
    retailersCount = await Retailer.countDocuments();
    categoriesCount = await Category.countDocuments();
    productsCount = await Product.countDocuments();
    quotationsCount = await Quote.countDocuments();
  } else if (isRetailer) {
    retailersCount = 0;
    categoriesCount = await Category.countDocuments({ retailerId: userId });

    // Fetch all categories that belong to the retailer
    const retailerCategories = await Category.find({ retailerId: userId }).select('_id');
    const categoryIds = retailerCategories.map(cat => cat._id);

    // Count products that belong to the fetched categories
    productsCount = await Product.countDocuments({ categories: { $in: categoryIds } });

    quotationsCount = await Quote.countDocuments({ retailerId: userId }); // Assuming quotes have a retailerId field
  }

  return {
    retailers: retailersCount,
    categories: categoriesCount,
    products: productsCount,
    quotations: quotationsCount,
  };
};


// GET Admin Data from DB
router.get('/infodata',auth, async (req, res) => {
  try {
    const { _id, isAdmin, isRetailer } = req.user;
    const counts = await getCounts(_id, isAdmin, isRetailer);
    res.json(counts);
  } catch (err) {
    console.log(err, "message error");
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token.');
    }
    res.status(500).send('Server error');
  }
});

// DELETE an admin by ID

router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).send('Admin not found');
    }
    res.send('Admin deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone } = req.body;

    let updatedUser;

    // Check if the user is an admin
    if (req.user.isAdmin) {
      // Update the admin document in the database
      updatedUser = await Admin.findByIdAndUpdate(id, { name, email, phone }, { new: true });
    } 
    // If the user is a retailer
    else if (req.user.isRetailer) {
      // Update the retailer document in the database
      // Assuming you have a Retailer model
      updatedUser = await Retailer.findByIdAndUpdate(id, { name, email, phone }, { new: true });
    } 
    // If the user doesn't match any known roles
    else {
      return res.status(400).send("Invalid user role.");
    }

    // Check if the user was not found and updated
    if (!updatedUser) {
      return res.status(404).send('User not found.');
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Simple Password Update

router.post('/password', auth, async (req, res) => {
  try {
    let user;

    // Check if the user is an admin
    if (req.user.isAdmin) {
      user = await Admin.findById(req.user._id);
    } 
    // If the user is a retailer
    else if (req.user.isRetailer) {
      user = await Retailer.findById(req.user._id);
    } 
    // If the user doesn't match any known roles
    else {
      return res.status(400).send("Invalid user role.");
    }

    if (!user) {
      return res.status(404).send('User not found.');
    }

    const { oldPassword, newPassword } = req.body;

    // Compare old password with the one in the database
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password.');
    }

    // Generate the salt
    const salt = await bcrypt.genSalt(10);
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();
    res.status(200).send('Password updated successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});





// Route for password reset request
router.post('/forgot', async (req, res, next) => {
  try {
    const { email } = req.body
    // Generate a unique token for verification
    const token = crypto.randomBytes(20).toString('hex');
    // Find the user by email
    const adminData = await Admin.findOne({ email });
    if (!adminData) {
      return res.status(404).send('Admin not found');
    }
    // Save the token to the user's account
    adminData.resetToken = token;
    adminData.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await adminData.save();

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

router.post('/resetPassword/:token', async (req, res) => {
  const token = req.params.token
  const { password } = req.body;

  // Validate request body
  const { error } = passwordValidator({ password });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    // Find admin with matching generated token
    const admin = await Admin.findOne({ resetToken: token });
    if (!admin) {
      return res.status(400).send('Invalid reset token.');
    }

    // Check if reset token has expired
    if (Date.now() > admin.resetTokenExpires) {
      return res.status(400).send('Reset token has expired.');
    }

    // Hash new password and save to database
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    admin.resetToken = null;
    admin.resetTokenExpires = null;
    await admin.save();

    return res.status(200).send('Password reset successful.');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while resetting password.');
  }
});


// DELETE Retailer by ID

router.delete('/deleteRetailer/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const retailer = await Retailer.findByIdAndDelete(id);
    if (!retailer) {
      return res.status(404).send('Retailer not found');
    }
    res.send('Retailer deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Change Retailer Status

router.put('/changeRetailerStatus/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    // const retailerStatus = req.body.status
    const retailer = await Retailer.findByIdAndUpdate(id, { isActivated: true, distributionId: id });
    if (!retailer) {
      return res.status(404).send('Retailer not found');
    }
    res.send('Retailer Status Updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update Retailer Profile

router.put('/updateRetailerProfie/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    // const retailerStatus = req.body.status
    const retailer = await Retailer.findByIdAndUpdate(id, req.body);
    if (!retailer) {
      return res.status(404).send('Retailer not found');
    }
    res.send('Retailer Status Updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
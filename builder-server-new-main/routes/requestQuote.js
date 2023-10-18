const express = require("express");
const router = express.Router();
const { quoteValidator, Quote } = require('../models/quote')
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth')
const { renderEmailTemplate } = require('./E-Templates/Quote/EmailTemplate');
const { adminValidator, Admin } = require('../models/admin')
const { Retailer } = require('../models/retailer')
const cryptoUtils = require('../helperFunctions/cryptoUtils');


router.post('/', async (req, res) => {
    const encryptedRetId = JSON.parse(req.headers['x-retid']);
    // Check if the retId is available
    if (!encryptedRetId) {
        return res.status(400).send('Retailer Id is missing');
    }
    // Decrypt the retId
    let decryptedRetId;
    try {
        decryptedRetId = cryptoUtils.decrypt(encryptedRetId);
    } catch (error) {
        // If the decryption fails, handle the error appropriately
        return res.status(400).send('Invalid Retailer Id first');
    }

    let extendedRequestBody = {
        ...req.body,
        retailerId: decryptedRetId,
    };
    const { error,value } = quoteValidator(extendedRequestBody);
    console.log(error,"error")
    if (error) return res.status(400).send(error.details[0].message);

    // let encryptedKey = cryptoUtils.encrypt("640ffea1e095fdf714324d37");
    // let cookieValue = JSON.stringify(encryptedKey);
    // res.send(cookieValue)
    // Access the 'X-RetId' header

    const htmlOutput = await renderEmailTemplate(req.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kitbuildert101@gmail.com',
            pass: 'juyyjeupnuvsinoa',
        },
    });

    // Search for an admin
    const admin = await Admin.findOne(); // Adjust the query if needed

    // Search for the retailer using the decrypted retId
    const retailer = await Retailer.findOne({ _id: decryptedRetId });

    if (!retailer) {
        return res.status(400).send('Invalid Retailer Id second');
    }
    async function sendEmail(to, recipientType) {
        const htmlOutput = await renderEmailTemplate(req.body, recipientType);
        return transporter.sendMail({
          from: 'BaronTech-KitBuilder',
          to,
          subject: 'Kit-Builder Notification',
          html: htmlOutput,
        });
      }

    async function send() {
        try {
          if (admin) {
            await sendEmail(admin.email, 'admin');
          }
          if (retailer) {
            await sendEmail(retailer.email, 'retailer');
          }
          await sendEmail(value.email, 'recipient');
      
          value.retailerId = decryptedRetId;
          const newQuote = new Quote(value);
          await newQuote.save();
          res.status(200).send(newQuote);
        } catch (error) {
          res.send(error.message);
        }
      }

    send();
});



router.get('/', auth,async (req, res) => {
    try {
        console.log("hit")
      let quotesData;
  
      // Check if the user is an admin
      if (req.user.isAdmin) {
        quotesData = await Quote.find({});
      } 
      // If the user is a retailer
      else if (req.user.isRetailer) {
        quotesData = await Quote.find({ retailerId: req.user._id });
      } 
      // If the user doesn't match any known roles
      else {
        return res.status(400).send("Invalid user role.");
      }
  
      if (quotesData.length < 1) {
        return res.status(404).send("Sorry, there are no quotes available right now!");
      }
      res.status(200).send(quotesData);
    } catch (err) {
        console.log(err,"Error")
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  


  router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        let quote;
        // Check if the user is an admin
        if (req.user.isAdmin) {
            quote = await Quote.findByIdAndDelete(id);
        } 
        // If the user is a retailer
        else if (req.user.isRetailer) {
            quote = await Quote.findOneAndDelete({ _id: id, retailerId: req.user._id });
        } 
        // If the user doesn't match any known roles
        else {
            return res.status(400).send("Invalid user role.");
        }
        if (!quote) {
            return res.status(404).send('Quote not found or you do not have permission to delete it.');
        }
        res.send('Quote deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
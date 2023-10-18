const express = require("express");
const router = express.Router();
const { newsletterValidator, newsSubscriber } = require('../models/newsletter')
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth')
const { renderThankYouEmailTemplate } = require('./E-Templates/Subscribe/ThankYouEmailTemplate');
const { renderNewsletterTemplate } = require('./E-Templates/Newsletter/emailTemplate');
// Add new Subscriber

router.post('/', async (req, res) => {
  const { email } = req.body;
  const { error } = newsletterValidator({ email });
  if (error) return res.status(400).send(error.details[0].message);

  let subscriber = await newsSubscriber.findOne({ email });
  if (subscriber) return res.status(400).send('User already Subscribed.');

  try {
    const subscriberData = new newsSubscriber({ email });
    await subscriberData.save();

    // Prepare and send the thank you email
    const htmlOutput = await renderThankYouEmailTemplate({ email, firstName: 'User', companyName: 'Kit-builder' });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kitbuildert101@gmail.com',
        pass: 'juyyjeupnuvsinoa',
      },
    });

    await transporter.sendMail({
      from: 'BaronTech-KitBuilder',
      to: email,
      subject: 'Thank You for Subscribing',
      html: htmlOutput,
    });

    res.status(200).send(subscriberData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// // GET Subscribers Data from DB
router.get('/', async (req, res) => {
  const subscriberData = await newsSubscriber.find({})
  if (subscriberData.length < 1) return res.send("Sorry There are no Subscribers Available right Now!")
  res.status(200).send(subscriberData)
})
// DELETE Subscriber by email
router.delete('/deleteSubscriber', async (req, res) => {
  try {
    const { email } = req.body
    const subscriberData = await newsSubscriber.deleteMany({ email });
    if (!subscriberData) {
      return res.status(404).send('Subscriber not found');
    }
    res.send('UnSubscribed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Define a route for sending a batch of emails to all subscribers
router.post('/send-newsletter', auth, async (req, res) => {
  const { message, subject } = req.body;


  const subscriberData = await newsSubscriber.find({});

  if (subscriberData.length < 1) {
    return res.status(404).send('Subscribers not found');
  }
  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kitbuildert101@gmail.com',
      pass: "juyyjeupnuvsinoa"
    }
  });
  // Send email to each subscriber using Nodemailer
  subscriberData.forEach(async subscriber => {
    // Define message options
    const newsletter = {
      from: 'BaronTech-KitBuilder',
      to: subscriber.email,
      subject: `${subject}`,
      html: await renderNewsletterTemplate({
        email: subscriber.email,
        companyName: 'BaronTech-KitBuilder',
        message: message
      })
    };

    transporter.sendMail(newsletter, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Email sent to ${subscriber.email}: ${info.response}`);
      }
    });
  });

  res.status(200).send('Newsletter sent to all subscribers');
});



module.exports = router;
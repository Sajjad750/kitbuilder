const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const cryptoUtils = require('../helperFunctions/cryptoUtils');

router.get('/encrypt', (req, res) => {
    const { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid ID');
    }
  
    let encryptedId = cryptoUtils.encrypt(id);
    let encryptedValue = JSON.stringify(encryptedId);
    // Set the cookie options
    const cookieOptions = {
      httpOnly: true,
      path: '/',             // Set the path attribute to '/' so that the cookie is accessible across all paths of the domain.
      sameSite: 'None',      // Set the SameSite attribute to 'None' for cross-site access.
    };
  
    // Set the cookie here before sending the response
    res.cookie('retId', encryptedValue, cookieOptions);
    res.status(200).send(encryptedValue)

  });
  

  router.get('/decrypt', (req, res) => {
    const { hash } = req.query;
    if (!hash) {
      return res.status(400).send('Invalid hash');
    }
  
    try {
      let decryptedHash = JSON.parse(hash);
      let decryptedId = cryptoUtils.decrypt(decryptedHash);
  
      if (!mongoose.Types.ObjectId.isValid(decryptedId)) {
        return res.status(400).send('Decryption failed');
      }
  
      res.status(200).json({
        decryptedId: decryptedId
      });
  
    } catch (e) {
      console.error(e);
      return res.status(500).send('Decryption failed');
    }
  });
  

  module.exports = router;
  
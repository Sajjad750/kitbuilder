const express = require("express");
const router = express.Router();
const {fileValidator,newsFile} = require('../models/filesystem');
const MongoIdValidator = require('../helperFunctions/ObjectId_Validator')
const openAuth = require('../middleware/openAuth')


// Route to upload file data
router.post('/',openAuth ,async (req, res) => {
    try {
      const {filename,size,dimensions,preview} = req.body
      const { error } = fileValidator(req.body)
      if (error) return res.status(400).send(error.details[0].message)
      const file = new newsFile({filename,size,dimensions,preview});
      await file.save();
      res.status(201).send("File Uploaded Successfully!");
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Route to get all file data
  router.get('/',openAuth ,async (req, res) => {
    try {
      const files = await newsFile.find({});
      res.send(files);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Route to get specific file data by ID
  router.get('/:id', openAuth,async (req, res) => {
    try {
        const id = req.params.id
        const { idError } = MongoIdValidator(id)
        if (idError) return res.status(400).send(idError.details[0].message)
      const file = await newsFile.findById(id);
      if (!file) {
        return res.status(404).send("No such File Found!");
      }
      res.send(file);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  
  // Route to delete file data by ID
  router.delete('/:id', openAuth,async (req, res) => {
    try {
        const id = req.params.id
        const { idError } = MongoIdValidator(id)
        if (idError) return res.status(400).send(idError.details[0].message)
      const file = await newsFile.findByIdAndDelete(req.params.id);
      if (!file) {
        return res.status(404).send();
      }
      res.status(200).send("File Successfully Deleted");
    } catch (error) {
      res.status(500).send(error);
    }
  });

  //   Filter File name
  router.get('/filter/:name',openAuth ,async (req, res) => {
    const regex = new RegExp(req.params.name, 'i'); // case-insensitive regex
    try {
      const files = await newsFile.find({ filename: regex });
      res.json(files);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });



module.exports = router;

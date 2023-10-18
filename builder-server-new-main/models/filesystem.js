const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const fileSchema = new Schema({
    filename: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    dimensions: {
      type: String,
      required: true
    },
    preview: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  });

const fileValidator = (file) => {
    const schema = Joi.object({
        filename: Joi.string().min(1).max(1000).required(),
        size: Joi.string().min(1).max(1000).required(),
        dimensions: Joi.string().min(1).max(1000).required(),
        preview: Joi.string().min(1).max(1000).required(),
    })
    return schema.validate(file)
}

const newsFile = mongoose.model('newsFile', fileSchema)
module.exports = { fileValidator,newsFile }
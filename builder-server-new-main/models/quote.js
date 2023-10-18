const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const productSchema = new Schema({
  quantity: {
      type: Number,
      required: true,
      min: 1
  },
  smallSize: {
      type: Number,
      required: true,
      min: 0
  },
  mediumSize: {
      type: Number,
      required: true,
      min: 0
  },
  largeSize: {
      type: Number,
      required: true,
      min: 0
  },
  front: {
      type: Object,
      designPreview: String,
      data: Object
  },
  back: {
      type: Object,
      designPreview: String,
      data: Object
  }
});


const userQuote = new Schema({
  firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200
  },
  lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200
  },
  companyName: {
      type: String,
      minlength: 3,
      maxlength: 200
  },
  countryName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200
  },
  streetAddress: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
  },
  apartmentName: {
      type: String,
      minlength: 3,
      maxlength: 300
  },
  cityName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
  },
  regionName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
  },
  postalCode: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
  },
  phoneNumber: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
  },
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer",
    required: true
  },
  products: [productSchema]
});


const productValidation = Joi.object({
  quantity: Joi.number().min(1).required(),
  smallSize: Joi.number().min(0).required(),
  mediumSize: Joi.number().min(0).required(),
  largeSize: Joi.number().min(0).required(),
  front: Joi.object({
      designPreview: Joi.string().uri().required(),
      data: Joi.object().required()
  }).required(),
  back: Joi.object({
      designPreview: Joi.string().uri().required(),
      data: Joi.object().required()
  }).required()
});


const quoteValidator = (quote) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(200).required(),
    lastName: Joi.string().min(3).max(200).required(),
    companyName: Joi.string().allow('').min(3).max(200),
    countryName: Joi.string().min(3).max(200).required(),
    streetAddress: Joi.string().min(3).max(300).required(),
    apartmentName: Joi.string().allow('').min(3).max(300),
    cityName: Joi.string().min(3).max(300).required(),
    regionName: Joi.string().min(3).max(300).required(),
    postalCode: Joi.string().min(3).max(300).required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().min(5).max(255).required(),
    retailerId: Joi.string().required(),
    products: Joi.array().items(productValidation).required()
  })
  return schema.validate(quote);
};



const Quote = mongoose.model('Quote', userQuote)
module.exports = { quoteValidator,Quote }
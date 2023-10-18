const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    // required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null // set the default value to null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer"
  },
  restrictedRetailers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Retailer"
  }],
  description: {
    type: String,
    required: false // Making this optional, you can make it required if needed
  },
  videoLink: {
    type: String,
    required: false // Making this optional
  },
  imageGallery: [{
    type: String,
    required: false // Making this optional
  }],
});


const categoryValidator = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    image: Joi.string().min(2).max(1000).required(),
    parent: Joi.string().allow('', null),
    isActive: Joi.boolean().valid(true, false).required(),
    retailerId: Joi.string().min(2).max(200),
    restrictedRetailers: Joi.array().items(Joi.string()),
    description: Joi.string().min(5).max(1000), // assuming a max of 1000 characters for description
    videoLink: Joi.string().uri().max(500), // assuming it's a URI and max 500 chars
    imageGallery: Joi.array().items(Joi.string().uri().max(500)), // array of URIs, each max 500 chars
  });
  return schema.validate(category);
}

const Category = mongoose.model('Category', categorySchema);
module.exports = { categoryValidator, Category }


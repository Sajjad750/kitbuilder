const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const productSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    productImage:{
        type:String,
        required:true
    },
    linkfront:{
        type:String,
        required:true
    },
    linkback:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
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
        required: false
    },
    videoLink: {
        type: String,
        required: false
    },
    imageGallery: [{
        type: String,
        required: false
    }],
});

const productValidator = (product) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        linkfront: Joi.string().min(2).required(),
        linkback: Joi.string().min(2).required(),
        productImage: Joi.string().min(2).required(),
        isActive: Joi.boolean().valid(true, false).required(),
           retailerId: Joi.string().min(2).max(200).allow(null), 
        restrictedRetailers: Joi.array().items(Joi.string()),
        description: Joi.string().min(5).max(1000).allow(null, ''),
        videoLink: Joi.string().uri().max(500).allow(null, ''),
        imageGallery: Joi.array().items(Joi.string().uri().max(500)).optional(),
    });
    return schema.validate(product);
}

const Product = mongoose.model('Product', productSchema);
module.exports = { productValidator, Product }

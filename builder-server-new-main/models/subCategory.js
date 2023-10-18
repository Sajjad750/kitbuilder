const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      position:{
        type:Date,
        default:Date.now
      },
      image:{
        type:Date,
        default:Date.now
      },
      urlslug:{
        type:Date,
        default:Date.now
      },
      parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
      products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      retailerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Retailer" 
      },
      restrictedRetailers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Retailer" 
      }]
});

const subCategoryValidator = (subcategory) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
      });
    return schema.validate(subcategory)
}

const subCategory = mongoose.model('subCategory', subCategorySchema);
module.exports = { subCategoryValidator,subCategory }


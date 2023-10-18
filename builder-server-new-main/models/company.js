const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;


const productSchema = new Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  linkfront:{type:String,required:true},
  linkback:{type:String},
  urlslug:{type:String}
});

const categorySchema = new Schema({
  name: {type: String, required: true},
  products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength:2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength:1024,
    minlength:5
  },
  logo:{
    type:String,
    require:true
  },phone:{
    type:Number,
    required:true,
  },
  websiteurl:{
    type:String,
    required:true
  },
  categories: [
    {type: Schema.Types.ObjectId, ref: 'Category'}
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const companyValidator = (company) => {

    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(2).max(255).required(),
        websiteurl:Joi.string().required(),
        logo:Joi.string().required()
      });
    return schema.validate(company)

}

const Company = mongoose.model('Company', companySchema);
module.exports = { companyValidator,Company }


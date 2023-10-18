const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const config = require('config')
const jwt = require('jsonwebtoken');

const retailerSchema = new Schema({
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
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  isActivated:{
    type:Boolean,
    default:false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  distributionId:{
    type:String,
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type:String
},
resetTokenExpires: {
    type:Date
  },
    // add the domains field here
    domains: {
        type: [String],  // array of strings
        default: []      // default to an empty array
    },
    colorPalette: {
      type: [String],
      default: []
    },
    logo: {
      type: String,
      validate: {
        validator: function(v) {
          // Allow null values or valid URLs
          return v === null || /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Not a valid URL'
      },
      default: null
    },
    phone: {
      type: String,
      required: true,
      minlength: 1,  // Assuming a minimum length of 10 digits for a phone number
      maxlength: 40   // Considering country code and maximum possible length
    },
    
});

const retailerValidator = (retailer) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isDisabled: Joi.boolean(),
        colorPalette: Joi.array().items(Joi.string()),
        logo: Joi.string().uri().allow(null, ''),
        phone: Joi.string().min(1).max(40).required(),
      });
    return schema.validate(retailer)
}


retailerSchema.methods.generateAuthToken = function(){
  return  jwt.sign({_id:this._id,isRetailer:true}, "jwtPrivateKey")
}

const Retailer = mongoose.model('Retailer', retailerSchema);
module.exports = { retailerValidator,Retailer }


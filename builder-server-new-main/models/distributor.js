const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

const Schema = mongoose.Schema
const DistributorSchema = new Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
    },
    lastName:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
    },
    companyName:{
      type: String,
      minlength: 3,
      maxlength: 30    
    },
    countryName:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30  
    },
    streetAddress:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30      
    },
    apartmentName:{
      type: String,
      minlength: 3,
      maxlength: 30      
    },
    cityName:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30     
    },
    regionName:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30      
    },
    postalCode:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30      
    },
    phoneNumber:{
      type: String,
      required: true,   
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
    },
    websiteLink:{
      type:String,
      required:true,
      minlength:5,
      maxlength:1000
    },
    websiteLogo:{
      type:String,
      require:true,
      minlength:5,
      maxlength:1000
    },
    isActive:{
      type:Boolean,
      default:true
    },
    retailerId: {
      type: Schema.Types.ObjectId,
      ref: 'Retailer'
    }
  });



const distributorValidator = (quote) => {

    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        companyName: Joi.string().allow('').min(3).max(30),
        countryName: Joi.string().min(3).max(30).required(),
        streetAddress: Joi.string().min(3).max(30).required(),
        apartmentName: Joi.string().allow('').min(3).max(30),
        cityName: Joi.string().min(3).max(30).required(),
        regionName: Joi.string().min(3).max(30).required(),
        postalCode: Joi.string().min(3).max(30).required(),
        phoneNumber: Joi.number().required(),
        email: Joi.string().email().min(5).max(255).required(),
        websiteLink: Joi.string().min(5).max(1000).required(),
        websiteLogo: Joi.string().min(5).max(1000).required(),
    })
    return schema.validate(quote)

}



const Distributor = mongoose.model('Distributor', DistributorSchema)
module.exports = { distributorValidator,Distributor }
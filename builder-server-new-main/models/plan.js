const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema

const planSchema = new Schema({
    name:{type: String,minlength:1,maxlength:50,required: true},
    price: {type: Number,minlength:1,required: true},
    duration: {type: String,enum: ['monthly', 'annual'], default: 'monthly', // could be 'monthly', 'annual', etc.
    required: true},
    features: {type: [String]} // an array of features included in the plan
  })

  const planValidator = (plan) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(30).required(),
        price: Joi.number().min(1).max(255).required(),
        duration: Joi.string().valid('monthly', 'annual').min(5).max(255).required(),
        features: Joi.array().items(Joi.string()),
    })
    return schema.validate(plan)
}

const Plan = mongoose.model('Plan', planSchema)
module.exports = {Plan,planValidator }

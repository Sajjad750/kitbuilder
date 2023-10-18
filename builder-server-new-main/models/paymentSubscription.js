const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const {Retailer} = require('../models/retailer')
const {Plan} = require('../models/plan')


const subscriptionSchema = new Schema({
    retailer: { type: Schema.Types.ObjectId,required: true, ref: 'Retailer' },
    plan: { type: Schema.Types.ObjectId,required: true, ref: 'Plan' },
    email:{type: String,required: true,minlength: 5,maxlength: 255},
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date },
    status: { type: String, enum: ['active', 'expired', 'canceled'], default: 'active' },
    payment_method: { type: String,minlength: 3,maxlength: 30 },
    payment_status: { type: String, enum: ['paid', 'pending', 'failed'],default:"paid" }
  });


const subscriptionValidator = (subscription) => {
    const schema = Joi.object({
        payment_method: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(5).max(255).required()
    })
    return schema.validate(subscription)
}


const Subscription = mongoose.model('Subscription', subscriptionSchema)
module.exports = { subscriptionValidator,Subscription }
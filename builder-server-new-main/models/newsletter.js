const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema
const subscriberSchema = new Schema({
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    }
  });



const newsletterValidator = (email) => {

    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),

    })
    return schema.validate(email)

}

const newsSubscriber = mongoose.model('newsSubscriber', subscriberSchema)
module.exports = { newsletterValidator,newsSubscriber }
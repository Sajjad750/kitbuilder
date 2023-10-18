const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')
const config = require('config')

const adminSchema = new Schema({
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
  phone: {
    type: String,
    maxlength:1024,
    minlength:2
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: true,
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
  }
});

const adminValidator = (admin) => {

    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        phone: Joi.string().min(2).max(1024)
      });
    return schema.validate(admin)

}

adminSchema.methods.generateAuthToken = function(){
  return  jwt.sign({_id:this._id,isAdmin:true}, "jwtPrivateKey")
  // return  jwt.sign({_id:this._id,isAdmin:true}, config.get("jwtPrivateKey"))
}
const Admin = mongoose.model('Admin', adminSchema);
module.exports = { adminValidator,Admin }


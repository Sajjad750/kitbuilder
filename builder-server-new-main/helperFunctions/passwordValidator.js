const Joi = require('joi');


const passwordValidator = (password) => {
    const schema = Joi.object({
        password: Joi.string().min(5).max(255).required()
      });
    return schema.validate(password)

}

module.exports = { passwordValidator }
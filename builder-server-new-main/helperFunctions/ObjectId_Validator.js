const mongoose = require('mongoose');

const MongoIdValidator = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return {
        error: {
          details: [{ message: 'Invalid ObjectId' }]
        }
      }
    }
    return { value: id };
  }

module.exports = MongoIdValidator;
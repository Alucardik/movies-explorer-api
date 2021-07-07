const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(mail) {
        return isEmail(mail);
      },
    },
    message: 'Пожалуйста, введите действительный email адрес',
  },
  name: {
    maxlength: 30,
    minlength: 2,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username: '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2: '';

  if(!Validator.isLength(data.username, { min: 6, max: 20})) {
    errors.name = 'username must be between 6 - 20 characters';
  }

  if(Validator.isEmpty(data.username)){
    errors.name = 'username field is required';
  }

  if(Validator.isEmpty(data.password, { min: 6, max:20 })){
    errors.name = 'password must be between 6 - 20 characters';
  }

  if(Validator.isEmpty(data.password2, { min: 6, max:20 })){
    errors.name = 'password must be between 6 - 20 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

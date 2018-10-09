
'use strict';

//dependencies
const { ConflictError, ValidationError, CastError } = require('./index');


module.exports = schema => {
  const handleMongoError = (error, next) => {
    switch (error.code) {
      case 11000: {
        // free mongo error message from database information because it might
        // be propagated to client and cause security breach
        // e.g 'error E11000 duplicate key error collection: conviness-test.users 
        // index: email_1 dup key: { : "sabryna_jones50@gmail.com" }', this will change to
        // 'dup key: { : "sabryna_jones50@gmail.com" }'
        const result = error.message.match(/dup key.*/);
        next(new ConflictError({ message: `${result[0]} already exist` }));
        break;
      }
      default:
        next(error);
    }
  };

  const handleValidationError = (error, next) => {
    // extract invalid path from mongo error message and make
    // them human friendly.
    let errorData = '';
    Object.keys(error.errors).forEach(key => {
      errorData += `${error.errors[key].message};`;
    });

    next(new ValidationError({ message: errorData, data: error }));
  };

  const handleCastError = (error, next) => {
    //castError occur with mongoose find operations fails;
    //it make sense to associate it with 404 http code i.e
    //resource not found
    next(new CastError(error));
  };

  let handleError = (error, res, next) => {
    switch (error.name) {
      case 'MongoError':
        handleMongoError(error, next);
        break;
      case 'ValidationError':
        handleValidationError(error, next);
        break;
      case 'CastError':
        handleCastError(error, next);
        break;
      default:
        next(error);
    }
  };
  // fired on save failure, commonly fired if unique field is absent etc 
  schema.post('save', handleError);
  // fired on schema validation failure, commonly fired if required field is missing etc
  schema.post('validate', handleError); // run 
  // fired on update failure
  schema.post('update', handleError);
  // fired on Model.create failure
  schema.post('insertMany', handleError);
  schema.post('find', handleError);
  schema.post('findOne', handleError);
  schema.post('findOneAndUpdate', handleError);
  schema.post('findOneAndRemove', handleError);
};

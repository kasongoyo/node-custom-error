/*
 * @file:  Nodejs Domain Based Errors
 * @Author: kasongoyo@gmail.com 
 * @Date: 2018-09-27 20:20:51 
 */

'use strict';

class DomainError extends Error {
  constructor(error) {
    super();
    // Ensure the name of this error is the same as the class name
    this.name = `Custom${this.constructor.name}`;
    if (typeof error === 'string') {
      // The argument passed is of string type so it means that's error message
      this.message = error;
    } else {
      // The argument passed is not string, this means it is an error object
      this.data = { error };
      this.message = error.message;
    }

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * The submitted request has invalid syntax 
 */
class ValidationError extends DomainError {
  constructor(error) {
    super(error);
    this.statusCode = 400;
  }
}

/**
 * Resource is locked and cannot be accessed
 */
class ResourceLockedError extends DomainError {
  constructor(error) {
    super(error);
    this.statusCode = 423;
  }
}

/**
 * The server refuse to fulfill the request for various reasons e.g
 * trying access protected resources etc
 */
class ForbiddenError extends DomainError {
  constructor(error) {
    super(error);
    this.statusCode = 403;
  }
}
/**
 * Request cannot be fulfilled because the request conflict with
 * some rules already established. E.g when you want to add duplicate
 * users in the server which doesn't allow duplicates
 */
class ConflictError extends DomainError {
  constructor(error) {
    super(error);
    this.statusCode = 409;
  }
}

/**
 * Occured when the resource to be manipulated cannot
 * be found.
 */
class NotFoundError extends DomainError {
  constructor(error) {
    super(error);
    this.statusCode = 404;
  }
}

/**
 * Occured when mongo find operation fails mainly because 
 * of the type of the supplied query parameter not
 * match with the type knowning by mongo
 */
class CastError extends DomainError {
  constructor(error) {
    super(error);
    this.statusCode = 404;
  }
}

module.exports = {
  ValidationError,
  ResourceLockedError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
  CastError
};


const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
//   console.log(value);
//   const message = `Duplicate field value : ${value}. Please use another value`;
//   return new AppError(message, 400);
// };
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('Invalid token .Please login again', 401);

const handleJWTExpiredError = (err) => {
  return new AppError('Your token has expired!Please log in again.', 401);
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log('Boom');
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error('ERROR 😖', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong..',
      });
    }
  } else {
    console.log('Boom');
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    } else {
      console.error('ERROR 😖', err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    // if ((err.code = 11000)) err = handleDuplicateFieldsDB(err);

    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') {
      err = handleJWTError(err);
      console.log(err);
    }
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
    sendErrorProd(err, req, res);
  }
};

const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoute');
const UserRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controller/errorController');
console.log(process.env.NODE_ENV);
const cookieParser = require('cookie-parser');
//Middleware
const bookingRouter = require('./routes/bookingRoutes');

const app = express();
const xss = require('xss-clean');
const hpp = require('hpp');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(helmet.contentSecurityPolicy());
//set SEcurity http headers
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'", 'default.example'],
      scriptSrc: ["'self'", 'js.example.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//Limit requeest from rate-limit api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour.',
});

app.use('/api', limiter);
// app.use(express.json());
app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());
//DATA SANITAIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANTIZATION AGAINST XSS
// app.use(xss());
//prevent paramater pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  // console.log(req.headers)
  next();
});
//My own middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware😂');
//   next();
// });

// app.get('/', (req, res) => {
//   res.json({ message: 'Hi from the server!!!', status: 200, app: 'Natours' });
// });

// app.get('/api/v1/tours',getAllTours );
// app.post('/api/v1/tours',createTours );
// app.get('/api/v1/tours/:id',getTour);
// app.patch('/api/v1/tours/:id',updateTour );
// app.delete('/api/v1/tours/:id',deleteTour );

app.use('/', viewRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'fail'
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;

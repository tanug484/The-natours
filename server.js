/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception😍');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection successful'));

/////Schema-->Model--->Document--->CRUD operations

///document
// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`The server is running on port :${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection🤣');
  server.close(() => {
    process.exit(1);
  });
});

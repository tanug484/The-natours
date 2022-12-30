const express = require('express');
const multer = require('multer');
const UserController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch(
  '/updateMyPassword',

  authController.updateMyPassword
);

router.get('/me', UserController.getMe, UserController.getUser);

router.patch(
  '/updateMe',
  UserController.uploadUserPhoto,
  UserController.resizeUserPhoto,
  UserController.updateMe
);
router.delete('/deleteMe', UserController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUsers);
router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;

const Review = require('./../models/reviewModel')
const AppError = require('./../utils/appError')
// const catchAsync = require('./../utils/catchAsync')
const handleFactory=require('./handlerFactory')

exports.setTourUserId = (req, res,next) => {
        if (!req.body.tour) req.body.tour = req.params.tourId;
        if (!req.body.user) req.body.user = req.user.id;
        next()
}
exports.getAllReviews = handleFactory.getAll(Review);
exports.createReview = handleFactory.createOne(Review)
exports.deleteReview = handleFactory.deleteOne(Review);
exports.updateReview = handleFactory.updateOne(Review);
exports.getReview=handleFactory.getOne(Review)
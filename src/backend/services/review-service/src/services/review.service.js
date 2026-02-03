const Review = require('../models/review.model');
console.log('>>> Review model =', Review);

exports.addReview = async (data) => {
  return await Review.create(data);
};

exports.getReviewsByProduct = async (productId) => {
  return await Review.findByProductId(productId);
};
const reviewService = require('../services/review.service');

exports.createReview = async (req, res) => {
  try {
    const result = await reviewService.addReview(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const data = await reviewService.getReviewsByProduct(req.params.productId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

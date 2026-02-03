const Promotion = require('../models/promotion.model');

exports.addPromotion = async (data) => {
  return await Promotion.create(data);
};

exports.getPromotionByProduct = async (productId) => {
  return await Promotion.findByProductId(productId);
};
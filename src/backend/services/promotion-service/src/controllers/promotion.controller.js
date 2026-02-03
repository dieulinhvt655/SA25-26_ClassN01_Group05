const promotionService = require('../services/promotion.service');

exports.createPromotion = async (req, res) => {
  try {
    const result = await promotionService.addPromotion(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPromotionByProduct = async (req, res) => {
  try {
    const data = await promotionService.getPromotionByProduct(req.params.productId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
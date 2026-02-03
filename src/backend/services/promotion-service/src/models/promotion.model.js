const db = require('../config/db');

exports.create = async (promotion) => {
  const { product_id, discount_percent, start_date, end_date } = promotion;

  const [result] = await db.execute(
    'INSERT INTO promotions (product_id, discount_percent, start_date, end_date) VALUES (?, ?, ?, ?)',
    [product_id, discount_percent, start_date, end_date]
  );

  return result;
};

exports.findByProductId = async (productId) => {
  const [rows] = await db.execute(
    'SELECT * FROM promotions WHERE product_id = ?',
    [productId]
  );
  return rows;
};
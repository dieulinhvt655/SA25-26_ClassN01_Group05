const db = require('../config/db');

exports.create = async (review) => {
  const { product_id, rating, comment } = review;
  const [result] = await db.execute(
    'INSERT INTO reviews (product_id, rating, comment) VALUES (?, ?, ?)',
    [product_id, rating, comment]
  );
  return result;
};

exports.findByProductId = async (productId) => {
  const [rows] = await db.execute(
    'SELECT * FROM reviews WHERE product_id = ?',
    [productId]
  );
  return rows;
};
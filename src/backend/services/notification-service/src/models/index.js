/**
 * Models Index
 * 
 * Tập trung export tất cả models và sequelize instance.
 * Notification Service không có quan hệ phức tạp giữa các bảng.
 */

const { sequelize } = require('../config/db');
const Notification = require('./notification.model');
const DeviceToken = require('./deviceToken.model');

module.exports = {
    sequelize,
    Notification,
    DeviceToken
};

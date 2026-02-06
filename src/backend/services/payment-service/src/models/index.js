const { sequelize } = require('../config/db');

// const sequelize = getDbConfig(); // Removed as getDbConfig is not exported

const Payment = require('./payment.model')(sequelize);
const PaymentTransaction = require('./transaction.model')(sequelize);

// Define Relationships
Payment.hasMany(PaymentTransaction, { foreignKey: 'paymentId', as: 'transactions' });
PaymentTransaction.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

module.exports = {
    sequelize,
    Payment,
    PaymentTransaction
};

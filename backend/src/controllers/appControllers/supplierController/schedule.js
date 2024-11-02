const schedule = require('node-schedule');
const Supplier = require('../../../models/appModels/Supplier');

const updateDebtStartForSuppliers = () => {
  schedule.scheduleJob('0 0 1 * *', async function () {
    try {
      await Supplier.updateMany(
        {},
        {
          $set: { debtStart: mongoose.col('debtEnd') },
        }
      );
      console.log('Hamma supplierlar uchun debtStart muvaffaqiyatli yangilandi');
    } catch (error) {
      console.error('Supplierlar uchun debtStart yangilashda xatolik:', error);
    }
  });
};

module.exports = updateDebtStartForSuppliers;
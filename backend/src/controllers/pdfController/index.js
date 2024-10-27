const pug = require('pug');
const fs = require('fs');
const moment = require('moment');
let pdf = require('html-pdf');
// const { listAllSettings, loadSettings } = require('@/middlewares/settings');
// const { getData } = require('@/middlewares/serverData');
// const { useMoney, useDate } = require('@/settings');

const pugFiles = ['clientinvoice', 'supplierinvoice', 'supplierpayment', 'payment'];

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

      // const settings = await loadSettings();

      // const {
      //   currency_symbol,
      //   currency_position,
      //   decimal_sep,
      //   thousand_sep,
      //   cent_precision,
      //   zero_format,
      // } = settings;

      // settings.public_server_file = process.env.PUBLIC_SERVER_FILE;
      // const moneyFormatter = ({ amount }) => {
      //   return amount;
      // };

      const moneyFormatter = ({ amount, currency_code = 'UZS' }) => {
        // Mintaqani valyuta kodiga qarab aniqlash
        const locale = currency_code === 'USD' ? 'en-US' : 'uz-UZ';

        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency_code,
          minimumFractionDigits: 2, // To display up to two decimal places
        }).format(amount);
      };
      const htmlContent = pug.renderFile('src/pdf/' + modelName + '.pug', {
        model: result,
        // settings,
        moneyFormatter,
        moment: moment,
      });

      pdf
        .create(htmlContent, {
          format: info.format,
          orientation: 'portrait',
          border: '10mm',
        })
        .toFile(targetLocation, function (error) {
          if (error) throw new Error(error);
          if (callback) callback();
        });
    }
  } catch (error) {
    throw new Error(error);
  }
};

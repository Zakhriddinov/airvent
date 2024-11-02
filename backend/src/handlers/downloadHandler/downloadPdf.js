const mongoose = require('mongoose');
const ClientInvoice = require('../../models/appModels/ClientInvoice');
const custom = require('../../controllers/pdfController');
const SupplierInvoice = require('../../models/appModels/SupplierInvoice');
const SupplierPayment = require('../../models/appModels/SupplierPayment');
module.exports = downloadPdf = async (req, res, { directory, id }) => {
  try {
    // Split the directory name into words and capitalize each word
    const modelName = directory
      .split(/[-_]/) // Split by hyphen or underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(''); // Join them back to form the model name

    const MODEL = {
      clientinvoice: ClientInvoice,
      supplierinvoice: SupplierInvoice,
      supplierpayment: SupplierPayment,
    };

    const Model = MODEL[modelName.toLowerCase()];
    const result = await Model.findOne({
      _id: id,
    }).exec();

    // Throw error if no result
    if (!result) {
      throw { name: 'ValidationError' };
    }

    // Continue process if result is returned

    const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
    const folderPath = modelName.toLowerCase();
    const targetLocation = `src/public/download/${folderPath}/${fileId}`;
    await custom.generatePdf(
      modelName,
      { filename: folderPath, format: 'A4', targetLocation },
      result,
      async () => {
        return res.download(targetLocation, (error) => {
          if (error)
            return res.status(500).json({
              success: false,
              result: null,
              message: "Couldn't find file",
              error: error.message,
            });
        });
      }
    );
    // } else {
    //   return res.status(404).json({
    //     success: false,
    //     result: null,
    //     message: `Model '${modelName}' does not exist`,
    //   });
    // }
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Required fields are not supplied',
      });
    } else if (error.name == 'BSONTypeError') {
      // If error is thrown by Mongoose due to invalid ID
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: error.message,
        message: error.message,
        controller: 'downloadPDF.js',
      });
    }
  }
};

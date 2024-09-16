const createCRUDController = require('../../middlewaresController/createCRUDController');

const create = require('./create');
const paginatedList = require('./paginatedList');

function modelController() {
  const methods = createCRUDController('SupplierInvoice');
  methods.create = (req, res) => create(req, res);
  methods.list = (req, res) => paginatedList(req, res);

  return methods;
}

module.exports = modelController();

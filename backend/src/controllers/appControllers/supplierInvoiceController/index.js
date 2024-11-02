const createCRUDController = require('../../middlewaresController/createCRUDController');

const create = require('./create');
const paginatedList = require('./paginatedList');
const read = require('./read');
const update = require('./update');

function modelController() {
  const methods = createCRUDController('SupplierInvoice');
  methods.create = (req, res) => create(req, res);
  methods.list = (req, res) => paginatedList(req, res);
  methods.read = (req, res) => read(req, res);
  methods.update = (req, res) => update(req, res);

  return methods;
}

module.exports = modelController();

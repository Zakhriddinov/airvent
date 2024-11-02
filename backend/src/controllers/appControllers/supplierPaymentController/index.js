const createCRUDController = require('../../middlewaresController/createCRUDController');
const SupplierPayment = require('../../../models/appModels/SupplierPayment');

const create = require('./create');
const paginatedList = require('./paginatedList');
const update = require('./update');

function modelController() {
  const Model = SupplierPayment;
  const methods = createCRUDController('SupplierPayment');

  methods.create = (req, res) => create(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);

  return methods;
}

module.exports = modelController();

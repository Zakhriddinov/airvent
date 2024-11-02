const createCRUDController = require('../../middlewaresController/createCRUDController');
const ClientInvoice = require('../../../models/appModels/ClientInvoice');

const create = require('./create');
const update = require('./update');
const read = require('./read');
const remove = require('./remove');
const summary = require('./summary');
const paginatedList = require('./paginatedList');

function modelController() {
  const Model = ClientInvoice;
  const methods = createCRUDController('ClientInvoice');

  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);

  return methods;
}

module.exports = modelController();

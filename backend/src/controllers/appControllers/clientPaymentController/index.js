const createCRUDController = require('../../middlewaresController/createCRUDController');
const ClientPayment = require('../../../models/appModels/ClientPayment');

const create = require('./create');
const paginatedList = require('./paginatedList');
const update = require('./update');
const remove = require('./remove');
const summary = require('./summary');

function modelController() {
  const Model = ClientPayment;
  const methods = createCRUDController('ClientPayment');

  methods.create = (req, res) => create(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);

  return methods;
}

module.exports = modelController();

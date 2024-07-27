const createCRUDController = require('../../middlewaresController/createCRUDController');
const PaymentMode = require('../../../models/appModels/PaymentMode');

const create = require('./create');
const paginatedList = require('./paginatedList');
const update = require('./update');
const listAll = require('./listAll');
const remove = require('./remove');
const read = require('./read');

function modelController() {
  const Model = PaymentMode;
  const methods = createCRUDController('PaymentMode');

  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.search = (req, res) => search(Model, req, res);
  methods.listAll = (req, res) => listAll(Model, req, res);

  return methods;
}

module.exports = modelController();

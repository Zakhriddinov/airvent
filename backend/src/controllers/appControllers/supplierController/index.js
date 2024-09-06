const createCRUDController = require('../../middlewaresController/createCRUDController');
const Supplier = require('../../../models/appModels/Supplier');

const create = require('./create');
const paginatedList = require('./paginatedList');
const listAll = require('./listAll');
const update = require('./update');

function modelController() {
  const Model = Supplier;
  const methods = createCRUDController('Supplier');

  methods.create = (req, res) => create(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.listAll = (req, res) => listAll(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);

  return methods;
}

module.exports = modelController();

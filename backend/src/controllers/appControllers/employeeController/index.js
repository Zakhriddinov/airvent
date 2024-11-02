const createCRUDController = require('../../middlewaresController/createCRUDController');
const Employee = require('../../../models/appModels/Employee');

const create = require('./create');
const summary = require('./summary');
const paginatedList = require('./paginatedList');
const update = require('./update');
const listAll = require('./listAll');
const remove = require('./remove');
const read = require('./read');

function modelController() {
  const Model = Employee;
  const methods = createCRUDController('Employee');

  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.search = (req, res) => search(Model, req, res);
  methods.listAll = (req, res) => listAll(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();
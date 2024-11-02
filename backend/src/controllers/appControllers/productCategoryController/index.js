const createCRUDController = require('../../middlewaresController/createCRUDController');
const remove = require('./remove');
const ProductCategory = require('../../../models/appModels/ProductCategory');

const create = require('./create');
const read = require('./read');
const update = require('./update');

const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

function modelController() {
  const Model = ProductCategory;
  const methods = createCRUDController('ProductCategory');

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

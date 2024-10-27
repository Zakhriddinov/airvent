const createCRUDController = require('../../middlewaresController/createCRUDController');
const Attendance = require('../../../models/appModels/Attendance');

const list = require('./list');
const update = require('./update');
const downloadFile = require('./downloadPdf');
const closeMonth = require('./closeMonth');
const summary = require('./summary');

function modelController() {
  const Model = Attendance;
  const methods = createCRUDController('Attendance');

  methods.list = (req, res) => list(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.downloadFile = (req, res) => downloadFile(Model, req, res);
  methods.closeMonth = (req, res) => closeMonth(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();

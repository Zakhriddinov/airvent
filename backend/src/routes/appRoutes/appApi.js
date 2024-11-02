const express = require('express');
const { catchErrors } = require('../../handlers/errorHandlers');
const router = express.Router();

const appControllers = require('../../controllers/appControllers');
const { routesList } = require('../../models/utils');

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  router.route(`/${entity}/:id/ref`).get(catchErrors(controller['ref']));

  router.route(`/${entity}/:year/:month`).get(catchErrors(controller['list']));
  router.route(`/${entity}/update`).put(catchErrors(controller['update']));
  router.route(`/${entity}/close-month`).post(catchErrors(controller['closeMonth']));
  // router.route(`/${entity}/download-pdf/:year/:month`).get(catchErrors(controller['downloadFile']));
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
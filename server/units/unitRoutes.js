var unitController = require('./unitController.js');

module.exports = function (app) {
  app.route('/material/')
    .get(unitController.getMaterialUnits)
    .post(unitController.addMaterialUnit);

  app.route('/material/:unit')
    .delete(unitController.removeMaterialUnit);

};

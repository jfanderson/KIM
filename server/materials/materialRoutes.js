var materialController = require('./materialController.js');

module.exports = function (app) {
  app.route('/')
    .get(materialController.getAllMaterials)
    .post(materialController.addMaterial);

  app.route('/:item')
    .get(materialController.getMaterial)
    .put(materialController.modifyMaterial)
    .delete(materialController.removeMaterial);
};

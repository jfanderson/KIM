var contractorController = require('./contractorController.js');

module.exports = function (app) {
  app.route('/')
    .get(contractorController.getAllContractors)
    .post(contractorController.addContractor);

  app.route('/:contractorId/material/:materialId')
    .post(contractorController.linkMaterial)
    .put(contractorController.modifyMaterialQty)
    .delete(contractorController.unlinkMaterial);

  app.route('/:contractorId')
    .get(contractorController.getContractor)
    .put(contractorController.modifyContractor)
    .delete(contractorController.removeContractor);
};

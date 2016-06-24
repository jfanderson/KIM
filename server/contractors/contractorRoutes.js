var contractorController = require('./contractorController.js');

module.exports = function(app) {
  app.route('/')
    .get(contractorController.getAllContractors)
    .post(contractorController.addContractor);

  app.route('/:contractorId/material/:materialId')
    .put(contractorController.materialsToContractor);

  app.route('/:contractorId/piece/:pieceId')
    .put(contractorController.piecesFromContractor);

  app.route('/:contractorId')
    .get(contractorController.getContractor)
    .put(contractorController.modifyContractor)
    .delete(contractorController.removeContractor);
};

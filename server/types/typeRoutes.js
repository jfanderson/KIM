var typeController = require('./typeController.js');

module.exports = function (app) {
  app.route('/pieces')
    .get(typeController.getPieceTypes)
    .post(typeController.addPieceType);

  app.route('/pieces/:name')
    .put(typeController.modifyPieceType)
    .delete(typeController.removePieceType);

  app.route('/materials')
    .get(typeController.getMaterialTypes)
    .post(typeController.addMaterialType);

  app.route('/materials/:name')
    .put(typeController.modifyMaterialType)
    .delete(typeController.removeMaterialType);

};

var pieceController = require('./pieceController.js');

module.exports = function (app) {
  app.route('/')
    .get(pieceController.getAllPieces)
    .post(pieceController.addPiece);

  app.route('/:id')
    .put(pieceController.modifyPiece)
    .delete(pieceController.removePiece);
};

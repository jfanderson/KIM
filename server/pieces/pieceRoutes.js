var pieceController = require('./pieceController.js');

module.exports = function (app) {
  app.route('/')
    .get(pieceController.getAllPieces)
    .post(pieceController.addPiece);

  app.route('/:pieceId')
    .get(pieceController.getPiece)
    .put(pieceController.modifyPiece)
    .delete(pieceController.removePiece);
};

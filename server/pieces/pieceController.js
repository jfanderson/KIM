var Piece = require('../db/index.js').Piece;

module.exports = {

  getAllPieces: function(req, res) {
    Piece.findAll().then(function(pieces) {
      res.status(200).send({ pieces: pieces });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addPiece: function(req, res) {
    Piece.create(req.body.piece).then(function(piece) {
      res.status(201).send({ piece: piece });
    }).catch(function(error) {
      console.log(error);
      if (error.errors[0].message === 'item must be unique') {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    });
  },

  modifyPiece: function(req, res) {
    Piece.findOne({ where: { item: req.params.item } }).then(function(piece) {
      if (piece === null) {
        res.sendStatus(404);
      } else {
        piece.update(req.body).then(function(updatedPiece) {
          res.status(200).send({ piece: updatedPiece });
        });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removePiece: function(req, res) {
    Piece.findOne({ where: {item: req.params.item } }).then(function(piece) {
      if (piece === null) {
        res.sendStatus(404);
      } else {
        return piece.destroy();
      }
    }).then(function() {
      res.sendStatus(204);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  }

};

var models = require('../db/index.js');
var Piece = models.Piece;
var PieceType = models.PieceType;

module.exports = {

  getPiece: function(req, res) {
    Piece.findOne({ where: { item: req.params.item }}).then(function(piece) {
      if (piece === null) {
        res.sendStatus(404);
      } else {
        res.status(200).send({ piece: piece });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  getAllPieces: function(req, res) {
    Piece.findAll().then(function(pieces) {
      res.status(200).send({ pieces: pieces });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addPiece: function(req, res) {
    // save type to associate later
    if (req.body.piece.hasOwnProperty('type')) {
      var type = req.body.piece.type;
      delete req.body.piece.type;
    }

    Piece.create(req.body.piece).then(function(piece) {
      // associate type if given
      if (type) {
        PieceType.findOne({ where: { name: type }}).then(function(matchedType) {
          if (matchedType !== null) {
            piece.typeId = matchedType.id;
          }
          res.status(201).send({ piece: piece });
        });
      } else {
        res.status(201).send({ piece: piece });
      }
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
      } else if (req.body.hasOwnProperty('type')) {
        // modify type if necessary
        PieceType.findOne({ where: { name: req.body.type }}).then(function(matchedType) {
          if (matchedType !== null) {
            piece.typeId = matchedType.id;
          }
          delete req.body.type;

          piece.update(req.body).then(function(updatedPiece) {
            res.status(200).send({ piece: updatedPiece });
          });
        });
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

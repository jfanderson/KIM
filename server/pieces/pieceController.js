var models = require('../db/index.js');
var Piece = models.Piece;
var PieceType = models.PieceType;
var Material = models.Material;
var PieceMaterial = models.PieceMaterial;

module.exports = {
  getPiece: getPiece,
  getAllPieces: getAllPieces,
  addPiece: addPiece,
  modifyPiece: modifyPiece,
  removePiece: removePiece,
  linkMaterial: linkMaterial,
  modifyMaterialQty: modifyMaterialQty,
  unlinkMaterial: unlinkMaterial
};

function getPiece(req, res) {
  Piece.findById(req.params.pieceId).then(function(piece) {
    if (piece === null) {
      res.sendStatus(404);
    } else {
      res.status(200).send({ piece: piece });
    }
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

function getAllPieces(req, res) {
  Piece.findAll().then(function(pieces) {
    res.status(200).send({ pieces: pieces });
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

function addPiece(req, res) {
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
}

function modifyPiece(req, res) {
  Piece.findById(req.params.pieceId).then(function(piece) {
    if (piece === null) {
      res.sendStatus(404);
    } else if (req.body.hasOwnProperty('type')) {
      // modify type if necessary
      PieceType.findOne({ where: { name: req.body.type }}).then(function(matchedType) {
        delete req.body.type;

        if (matchedType !== null) {
          req.body.typeId = matchedType.id;
        }

        return piece.update(req.body).then(function(updatedPiece) {
          res.status(200).send({ piece: updatedPiece });
        });
      });
    } else {
      return piece.update(req.body).then(function(updatedPiece) {
        res.status(200).send({ piece: updatedPiece });
      });
    }
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

function removePiece(req, res) {
  Piece.findById(req.params.pieceId).then(function(piece) {
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

function linkMaterial(req, res) {
  Piece.findById(req.params.pieceId).then(function(piece) {
    if (piece === null) {
      res.sendStatus(404);
    }

    return piece.addMaterial(req.params.materialId).then(function() {
      res.sendStatus(200);
    });
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

function modifyMaterialQty(req, res) {
  PieceMaterial.findOne({
    where: {
      pieceId: req.params.pieceId,
      materialId: req.params.materialId
    }
  }).then(function(result) {
    if (result === null) {
      res.sendStatus(404);
    }

    return result.update({ qty: req.body.qty }).then(function() {
      res.sendStatus(200);
    });
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

function unlinkMaterial(req, res) {
  Piece.findById(req.params.pieceId).then(function(piece) {
    if (piece === null) {
      res.sendStatus(404);
    }

    return piece.removeMaterial(req.params.materialId).then(function() {
      res.sendStatus(204);
    });
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

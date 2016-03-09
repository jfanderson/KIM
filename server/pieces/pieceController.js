var models = require('../db/index.js');
var Piece = models.Piece;
var PieceType = models.PieceType;
var Material = models.Material;
var PieceMaterial = models.PieceMaterial;

module.exports = {
  getPiece,
  getAllPieces,
  addPiece,
  modifyPiece,
  removePiece,
  linkMaterial,
  modifyMaterialQty,
  unlinkMaterial
};

function getPiece(req, res) {
  Piece.findById(req.params.pieceId).then(piece => {
    if (piece === null) {
      res.sendStatus(404);
    } else {
      piece.getMaterials().then(materials => {
        piece = piece.toJSON();
        piece.materials = materials || [];
        res.status(200).send({ piece: piece });
      });
    }
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function getAllPieces(req, res) {
  Piece.findAll().then(pieces => {
    res.status(200).send({ pieces: pieces });
  }).catch(error => {
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

  Piece.create(req.body.piece).then(piece => {
    // associate type if given
    if (type) {
      PieceType.findOne({ where: { name: type }}).then(matchedType => {
        if (matchedType !== null) {
          piece.typeId = matchedType.id;
        }
        res.status(201).send({ piece: piece });
      });
    } else {
      res.status(201).send({ piece: piece });
    }
  }).catch(error => {
    console.log(error);
    if (error.errors[0].message === 'item must be unique') {
      res.sendStatus(409);
    } else {
      res.sendStatus(500);
    }
  });
}

function modifyPiece(req, res) {
  Piece.findById(req.params.pieceId).then(piece => {
    if (piece === null) {
      res.sendStatus(404);
      return;
    }

    // modify type if necessary
    if (req.body.hasOwnProperty('type')) {
      return PieceType.findOne({ where: { name: req.body.type }}).then(matchedType => {
        delete req.body.type;

        if (matchedType === null) {
          res.sendStatus(404);
          return;
        } else {
          req.body.typeId = matchedType.id;
        }

        return piece;
      });
    } else {
      return piece;
    }
  }).then(piece => {
    if (!piece) {
      return;
    }

    // check for increase in pieces
    var delta = req.body.qtyInStock - piece.get('qtyInStock');

    // reduce material stock if new pieces have been made
    if (req.body.hasOwnProperty('qtyInStock') && delta > 0) {
      return piece.getMaterials().then(materials => {
        return Promise.all(materials.map(material => {
          var newQty = material.get('qtyInStock') - (delta * material.PieceMaterial.get('qty'));
          return material.update({ qtyInStock: newQty });
        })).then(() => {
          return piece;
        });
      });
    } else {
      return piece;
    }
  }).then(piece => {
    if (piece) {
      return piece.update(req.body).then(updatedPiece => {
        res.status(200).send({ piece: updatedPiece });
      });
    }
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function removePiece(req, res) {
  Piece.findById(req.params.pieceId).then(piece => {
    if (piece === null) {
      res.sendStatus(404);
    } else {
      return piece.destroy();
    }
  }).then(() => {
    res.sendStatus(204);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function linkMaterial(req, res) {
  Piece.findById(req.params.pieceId).then(piece => {
    if (piece === null) {
      res.sendStatus(404);
    }

    return piece.addMaterial(req.params.materialId).then(() => {
      res.sendStatus(200);
    });
  }).catch(error => {
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
  }).then(result => {
    if (result === null) {
      res.sendStatus(404);
    }

    return result.update({ qty: req.body.qty }).then(() => {
      res.sendStatus(200);
    });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function unlinkMaterial(req, res) {
  Piece.findById(req.params.pieceId).then(piece => {
    if (piece === null) {
      res.sendStatus(404);
    }

    return piece.removeMaterial(req.params.materialId).then(() => {
      res.sendStatus(204);
    });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

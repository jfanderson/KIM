var models = require('../db/index.js');
var Contractor = models.Contractor;
var ContractorMaterial = models.ContractorMaterial;
var Material = models.Material;
var Piece = models.Piece;

module.exports = {
  getContractor,
  getAllContractors,
  addContractor,
  modifyContractor,
  removeContractor,
  linkMaterial,
  materialsToContractor,
  piecesFromContractor,
  unlinkMaterial
};

function getContractor(req, res) {
  Contractor.findById(req.params.contractorId).then(contractor => {
    if (contractor === null) {
      res.sendStatus(404);
    } else {
      contractor.getMaterials().then(materials => {
        contractor = contractor.toJSON();
        contractor.materials = materials || [];
        res.status(200).send({ contractor });
      });
    }
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function getAllContractors(req, res) {
  Contractor.findAll().then(contractors => {
    res.status(200).send({ contractors });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function addContractor(req, res) {
  Contractor.create(req.body.contractor).then(contractor => {
    Material.findAll().then(materials => {
      return Promise.all(materials.map(material => material.addContractor(contractor.id)))
      .then(() => {
        res.status(201).send({ contractor });
      });
    });
  }).catch(error => {
    console.log(error);
    if (error.errors[0].message === 'item must be unique') {
      res.sendStatus(409);
    } else {
      res.sendStatus(500);
    }
  });
}

function modifyContractor(req, res) {
  Contractor.findById(req.params.contractorId).then(contractor => {
    if (contractor === null) {
      res.sendStatus(404);
      return;
    }

    return contractor.update(req.body).then(updatedContractor => {
      res.status(200).send({ contractor: updatedContractor });
    });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function removeContractor(req, res) {
  Contractor.findById(req.params.contractorId).then(contractor => {
    if (contractor === null) {
      res.sendStatus(404);
    } else {
      return contractor.destroy();
    }
  }).then(() => {
    res.sendStatus(204);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function linkMaterial(req, res) {
  Contractor.findById(req.params.contractorId).then(contractor => {
    if (contractor === null) {
      res.sendStatus(404);
    }

    var options = {};
    if (req.body.qty) {
      options.qty = req.body.qty;
    }

    return contractor.addMaterial(req.params.materialId, options).then(() => {
      res.sendStatus(200);
    });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

// Add to contractor's qty and deduct from qtyInStock.
function materialsToContractor(req, res) {
  ContractorMaterial.findOne({
    where: {
      contractorId: req.params.contractorId,
      materialId: req.params.materialId
    }
  }).then(result => {
    if (result === null) {
      return res.sendStatus(404);
    }

    var newQty = result.qty + req.body.qty;
    return result.update({ qty: newQty });
  }).then(() => {
    return Material.findById(req.params.materialId);
  }).then(material => {
    var newQtyInStock = material.qtyInStock - req.body.qty;
    return material.update({ qtyInStock: newQtyInStock });
  }).then(() => {
    res.sendStatus(200);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function piecesFromContractor(req, res) {
  Piece.findById(req.params.pieceId).then(piece => {
    return piece.update({ qtyInStock: piece.qtyInStock + req.body.qty });
  }).then(piece => {
    return piece.getMaterials();
  }).then(materials => {
    return Promise.all(materials.map(material => {
      return ContractorMaterial.findOne({
        where: {
          contractorId: req.params.contractorId,
          materialId: material.id
        }
      }).then(result => {
        var newQty = result.qty - material.PieceMaterial.qty;
        return result.update({ qty: newQty });
      });
    }));
  }).then(() => {
    res.sendStatus(200);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function unlinkMaterial(req, res) {
  Contractor.findById(req.params.contractorId).then(contractor => {
    if (contractor === null) {
      res.sendStatus(404);
    }

    return contractor.removeMaterial(req.params.materialId).then(() => {
      res.sendStatus(204);
    });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

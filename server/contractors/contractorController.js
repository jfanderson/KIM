var models = require('../db/index.js');
var Contractor = models.Contractor;
var ContractorMaterial = models.ContractorMaterial;
var Material = models.Material;

module.exports = {
  getContractor,
  getAllContractors,
  addContractor,
  modifyContractor,
  removeContractor,
  linkMaterial,
  modifyMaterialQty,
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

function modifyMaterialQty(req, res) {
  ContractorMaterial.findOne({
    where: {
      contractorId: req.params.contractorId,
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

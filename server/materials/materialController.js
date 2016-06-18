var models = require('../db/index.js');
var Material = models.Material;
var MaterialType = models.MaterialType;
var Vendor = models.Vendor;

module.exports = {
  getMaterial,
  getAllMaterials,
  addMaterial,
  modifyMaterial,
  removeMaterial
};

function getMaterial(req, res) {
  Material.findById(req.params.materialId).then(material => {
    if (material === null) {
      res.sendStatus(404);
    } else {
      res.status(200).send({ material });
    }
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function getAllMaterials(req, res) {
  Material.findAll().then(materials => {
    res.status(200).send({ materials });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function addMaterial(req, res) {
  // save type, unit and vendor to associate later
  var type;
  var unit;
  var vendor;

  if (req.body.material.hasOwnProperty('type')) {
    type = req.body.material.type;
    delete req.body.material.type;
  }

  if (req.body.material.hasOwnProperty('unit')) {
    unit = req.body.material.unit;
    delete req.body.material.unit;
  }

  if (req.body.material.hasOwnProperty('vendor')) {
    vendor = req.body.material.vendor;
    delete req.body.material.vendor;
  }

  Material.create(req.body.material).then(material => {
    // associate type if given
    if (type) {
      return MaterialType.findOne({ where: { name: type } }).then(matchedType => {
        if (matchedType !== null) {
          material.typeId = matchedType.id;
        }
        return material.save();
      });
    }

    return material;
  }).then(material => {
    // associate vendor if given
    if (vendor) {
      return Vendor.findOne({ where: { company: vendor } }).then(matchedVendor => {
        if (matchedVendor !== null) {
          material.vendorId = matchedVendor.id;
        }
        return material.save();
      });
    }

    return material;
  }).then(material => {
    res.status(201).send({ material });
  }).catch(error => {
    console.log(error);
    if (error.errors[0].message === 'item must be unique') {
      res.sendStatus(409);
    } else {
      res.sendStatus(500);
    }
  });
}

function modifyMaterial(req, res) {
  Material.findById(req.params.materialId).then(material => {
    if (material === null) {
      res.sendStatus(404);
    } else {
      return material;
    }
  }).then(material => {
    // modify type if necessary
    if (req.body.hasOwnProperty('type')) {
      return MaterialType.findOne({ where: { name: req.body.type } }).then(matchedType => {
        if (matchedType !== null) {
          material.set('typeId', matchedType.id);
        }
        delete req.body.type;
        return material.save();
      });
    }

    return material;
  }).then(material => {
    // modify vendor if necessary
    if (req.body.hasOwnProperty('vendor')) {
      return Vendor.findOne({ where: { company: req.body.vendor } }).then(matchedVendor => {
        if (matchedVendor !== null) {
          material.set('vendorId', matchedVendor.id);
        }
        delete req.body.vendor;
        return material.save();
      });
    }

    return material;
  }).then(material => {
    material.update(req.body).then(updatedMaterial => {
      res.status(200).send({ material: updatedMaterial });
    });
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

function removeMaterial(req, res) {
  Material.findById(req.params.materialId).then(material => {
    if (material === null) {
      res.sendStatus(404);
    } else {
      return material.destroy();
    }
  }).then(() => {
    res.sendStatus(204);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
}

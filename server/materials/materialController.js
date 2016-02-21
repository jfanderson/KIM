var models = require('../db/index.js');
var Material = models.Material;
var MaterialType = models.MaterialType;
var MaterialUnit = models.MaterialUnit;
var Vendor = models.Vendor;

module.exports = {

  getMaterial: function(req, res) {
    Material.findById(req.params.materialId).then(function(material) {
      if (material === null) {
        res.sendStatus(404);
      } else {
        res.status(200).send({ material: material });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  getAllMaterials: function(req, res) {
    Material.findAll().then(function(materials) {
      res.status(200).send({ materials: materials });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addMaterial: function(req, res) {
    // save type, unit and vendor to associate later
    if (req.body.material.hasOwnProperty('type')) {
      var type = req.body.material.type;
      delete req.body.material.type;
    }

    if (req.body.material.hasOwnProperty('unit')) {
      var unit = req.body.material.unit;
      delete req.body.material.unit;
    }

    if (req.body.material.hasOwnProperty('vendor')) {
      var vendor = req.body.material.vendor;
      delete req.body.material.vendor;
    }

    Material.create(req.body.material).then(function(material) {
      // associate type if given
      if (type) {
        return MaterialType.findOne({ where: { name: type }}).then(function(matchedType) {
          if (matchedType !== null) {
            material.typeId = matchedType.id;
          }
          return material.save();
        });
      } else {
        return material;
      }
    }).then(function(material) {
      // associate unit if given
      if (unit) {
        return MaterialUnit.findOne({ where: { unit: unit }}).then(function(matchedUnit) {
          if (matchedUnit !== null) {
            material.unitId = matchedUnit.id;
          }
          return material.save();
        });
      } else {
        return material;
      }
    }).then(function(material) {
      // associate vendor if given
      if (vendor) {
        return Vendor.findOne({ where: { company: vendor }}).then(function(matchedVendor) {
          if (matchedVendor !== null) {
            material.vendorId = matchedVendor.id;
          }
          return material.save();
        });
      } else {
        return material;
      }
    }).then(function(material) {
      res.status(201).send({ material: material });
    }).catch(function(error) {
      console.log(error);
      if (error.errors[0].message === 'item must be unique') {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    });
  },

  modifyMaterial: function(req, res) {
    Material.findById(req.params.materialId).then(function(material) {
      if (material === null) {
        res.sendStatus(404);
      } else {
        return material;
      }
    }).then(function(material) {
      // modify type if necessary
      if (req.body.hasOwnProperty('type')) {
        return MaterialType.findOne({ where: { name: req.body.type }}).then(function(matchedType) {
          if (matchedType !== null) {
            material.set('typeId', matchedType.id);
          }
          delete req.body.type;
          return material.save();
        });
      } else {
        return material;
      }
    }).then(function(material) {
      // modify unit if necessary
      if (req.body.hasOwnProperty('unit')) {
        return MaterialUnit.findOne({ where: { unit: req.body.unit }}).then(function(matchedUnit) {
          if (matchedUnit !== null) {
            material.set('unitId', matchedUnit.id);
          }
          delete req.body.unit;
          return material.save();
        });
      } else {
        return material;
      }
    }).then(function(material) {
      // modify vendor if necessary
      if (req.body.hasOwnProperty('vendor')) {
        return Vendor.findOne({ where: { company: req.body.vendor }}).then(function(matchedVendor) {
          if (matchedVendor !== null) {
            material.set('vendorId', matchedVendor.id);
          }
          delete req.body.vendor;
          return material.save();
        });
      } else {
        return material;
      }
    }).then(function(material) {
      material.update(req.body).then(function(updatedMaterial) {
        res.status(200).send({ material: updatedMaterial });
      });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removeMaterial: function(req, res) {
    Material.findById(req.params.materialId).then(function(material) {
      if (material === null) {
        res.sendStatus(404);
      } else {
        return material.destroy();
      }
    }).then(function() {
      res.sendStatus(204);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  }

};

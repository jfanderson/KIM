var models = require('../db/index.js');
var Material = models.Material;
var MaterialType = models.MaterialType;

module.exports = {

  getMaterial: function(req, res) {
    Material.findOne({ where: { item: req.params.item }}).then(function(material) {
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
    // save type to associate later
    if (req.body.material.hasOwnProperty('type')) {
      var type = req.body.material.type;
      delete req.body.material.type;
    }

    Material.create(req.body.material).then(function(material) {
      // associate type if given
      if (type) {
        MaterialType.findOne({ where: { name: type }}).then(function(matchedType) {
          if (matchedType !== null) {
            material.typeId = matchedType.id;
          }
          res.status(201).send({ material: material });
        });
      } else {
        res.status(201).send({ material: material });
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

  modifyMaterial: function(req, res) {
    Material.findOne({ where: { item: req.params.item } }).then(function(material) {
      if (material === null) {
        res.sendStatus(404);
      } else if (req.body.hasOwnProperty('type')) {
        // modify type if necessary
        MaterialType.findOne({ where: { name: req.body.type }}).then(function(matchedType) {
          if (matchedType !== null) {
            material.typeId = matchedType.id;
          }
          delete req.body.type;

          material.update(req.body).then(function(updatedMaterial) {
            res.status(200).send({ material: updatedMaterial });
          });
        });
      } else {
        material.update(req.body).then(function(updatedMaterial) {
          res.status(200).send({ material: updatedMaterial });
        });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removeMaterial: function(req, res) {
    Material.findOne({ where: {item: req.params.item } }).then(function(material) {
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

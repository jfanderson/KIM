var models = require('../db/index.js');
var MaterialUnit = models.MaterialUnit;

module.exports = {

  getMaterialUnits: function(req, res) {
    MaterialUnit.findAll().then(function(units) {
      res.status(200).send({ units: units });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addMaterialUnit: function(req, res) {
    MaterialUnit.create(req.body.unit).then(function(newUnit) {
      res.status(201).send({ unit: newUnit });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removeMaterialUnit: function(req, res) {
    MaterialUnit.findById(req.params.unitId).then(function(unit) {
      if (unit === null) {
        res.sendStatus(404);
      } else {
        return unit.destroy();
      }
    }).then(function() {
      res.sendStatus(204);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

};

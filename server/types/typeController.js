var models = require('../db/index.js');
var PieceType = models.PieceType;
var MaterialType = models.MaterialType;

module.exports = {

  getPieceTypes: function(req, res) {
    PieceType.findAll().then(function(types) {
      res.status(200).send({ types: types });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addPieceType: function(req, res) {
    PieceType.create(res.body.type).then(function(newType) {
      res.status(201).send({ type: newType });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  modifyPieceType: function(req, res) {
    PieceType.findOne({ where: { name: req.params.name }}).then(function(type) {
      if (type === null) {
        res.sendStatus(404);
      } else {
        type.update(req.body).then(function(updatedType) {
          res.status(200).send({ type: updatedType });
        });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removePieceType: function(req, res) {
    PieceType.findOne({ where: { name: req.params.name }}).then(function(type) {
      if (type === null) {
        res.sendStatus(404);
      } else {
        return type.destroy();
      }
    }).then(function() {
      res.sendStatus(204);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  getMaterialTypes: function(req, res) {
    MaterialType.findAll().then(function(types) {
      res.status(200).send({ types: types });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addMaterialType: function(req, res) {
    MaterialType.create(res.body.type).then(function(newType) {
      res.status(201).send({ type: newType });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  modifyMaterialType: function(req, res) {
    MaterialType.findOne({ where: { name: req.params.name }}).then(function(type) {
      if (type === null) {
        res.sendStatus(404);
      } else {
        type.update(req.body).then(function(updatedType) {
          res.status(200).send({ type: updatedType });
        });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removeMaterialType: function(req, res) {
    MaterialType.findOne({ where: { name: req.params.name }}).then(function(type) {
      if (type === null) {
        res.sendStatus(404);
      } else {
        return type.destroy();
      }
    }).then(function() {
      res.sendStatus(204);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  }

};

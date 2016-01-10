var models = require('../db/index.js');
var Vendor = models.Vendor;

module.exports = {

  getVendors: function(req, res) {
    Vendor.findAll().then(function(vendors) {
      res.status(200).send({ vendors: vendors });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  addVendor: function(req, res) {
    Vendor.create(req.body.vendor).then(function(newVendor) {
      res.status(201).send({ vendor: newVendor });
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  modifyVendor: function(req, res) {
    Vendor.findOne({ where: { company: req.params.company }}).then(function(vendor) {
      if (vendor === null) {
        res.sendStatus(404);
      } else {
        vendor.update(req.body).then(function(updatedVendor) {
          res.status(200).send({ vendor: updatedVendor });
        });
      }
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

  removeVendor: function(req, res) {
    Vendor.findOne({ where: { company: req.params.company }}).then(function(vendor) {
      if (vendor === null) {
        res.sendStatus(404);
      } else {
        return vendor.destroy();
      }
    }).then(function() {
      res.sendStatus(204);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  },

};

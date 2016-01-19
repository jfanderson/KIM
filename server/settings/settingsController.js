var models = require('../db/index.js');
var Settings = models.Settings;

module.exports = {
  getAllSettings: getAllSettings,
  modifyLaborCost: modifyLaborCost
};

function getAllSettings(req, res) {
  Settings.findAll().then(function(settings) {
    res.status(200).send({
      settings: settings[0]
    });
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
}

function modifyLaborCost(req, res) {
  Settings.findAll().then(function(settings) {
    console.log(settings);
    if (settings.length === 0) {
      return Settings.create(req.body);
    } else {
      return settings[0].update(req.body);
    }
  }).then(function(settings) {
    res.status(200).send(settings[0]);
  });
}

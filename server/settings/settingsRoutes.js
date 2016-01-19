var settingsController = require('./settingsController.js');

module.exports = function(app) {
    app.route('/')
      .get(settingsController.getAllSettings);

    app.route('/laborCost')
      .post(settingsController.modifyLaborCost);
};

var vendorController = require('./vendorController.js');

module.exports = function (app) {
  app.route('/')
    .get(vendorController.getVendors)
    .post(vendorController.addVendor);

  app.route('/:vendorId')
    .put(vendorController.modifyVendor)
    .delete(vendorController.removeVendor);

};

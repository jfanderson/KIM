var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function(app, express) {
  // server logging
  app.use(morgan('dev'));

  // parse request payloads
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // instantiate destinations
  var materialRouter = express.Router();
  var pieceRouter = express.Router();
  var settingsRouter = express.Router();
  var typeRouter = express.Router();
  var unitRouter = express.Router();
  var vendorRouter = express.Router();

  // route requests to proper destination
  app.use('/materials', materialRouter);
  app.use('/pieces', pieceRouter);
  app.use('/settings', settingsRouter);
  app.use('/types', typeRouter);
  app.use('/units', unitRouter);
  app.use('/vendors', vendorRouter);

  // define destination pathways
  require('../materials/materialRoutes.js')(materialRouter);
  require('../pieces/pieceRoutes.js')(pieceRouter);
  require('../settings/settingsRoutes.js')(settingsRouter);
  require('../types/typeRoutes.js')(typeRouter);
  require('../units/unitRoutes.js')(unitRouter);
  require('../vendors/vendorRoutes.js')(vendorRouter);
};

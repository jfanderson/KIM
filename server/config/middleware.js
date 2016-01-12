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
  var typeRouter = express.Router();
  var vendorRouter = express.Router();
  var unitRouter = express.Router();

  // route requests to proper destination
  app.use('/materials', materialRouter);
  app.use('/pieces', pieceRouter);
  app.use('/types', typeRouter);
  app.use('/vendors', vendorRouter);
  app.use('/units', unitRouter);

  // define destination pathways
  require('../materials/materialRoutes')(materialRouter);
  require('../pieces/pieceRoutes.js')(pieceRouter);
  require('../types/typeRoutes.js')(typeRouter);
  require('../vendors/vendorRoutes.js')(vendorRouter);
  require('../units/unitRoutes.js')(unitRouter);
};

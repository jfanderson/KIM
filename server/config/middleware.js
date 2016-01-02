var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function(app, express) {
  // server logging
  app.use(morgan('dev'));

  // parse request payloads
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // instantiate destinations
  var pieceRouter = express.Router();
  var typeRouter = express.Router();

  // route requests to proper destination
  app.use('/pieces', pieceRouter);
  app.use('/types', typeRouter);

  // define destination pathways
  require('../pieces/pieceRoutes.js')(pieceRouter);
  require('../types/typeRoutes/js')(typeRouter);
};

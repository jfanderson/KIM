var Sequelize = require('sequelize');

/* CONNECTION */

var dbURL = process.env.DATABASE_URL;

if (dbURL) {
  var orm = new Sequelize(dbURL);
} else {
  var orm = new Sequelize('kim', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });
}


/* SCHEMA */

var Material = orm.define('Material', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: false, unique: true },
  vendor: Sequelize.STRING,
  costPerInch: { type: Sequelize.DECIMAL(10,2), defaultValue: 0.0 },
  unit: { type: Sequelize.STRING, defaultValue: 'unit' },
  qtyOnHand: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var Piece = orm.define('Piece', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: false, unique: true },
  laborTime: { type: Sequelize.INTEGER, defaultValue: 0 },
  totalCost: Sequelize.DECIMAL(10,2),
  wholesalePrice: Sequelize.DECIMAL(10,2),
  msrp: Sequelize.DECIMAL(10,2),
  qtyOnHand: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var MaterialType = orm.define('MaterialType', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  lowStock: Sequelize.INTEGER
});

var PieceType = orm.define('PieceType', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  lowStock: Sequelize.INTEGER
});

var MaterialPurchaseOrder = orm.define('MaterialPurchaseOrder', {
  metal: Sequelize.STRING,
  instructions: Sequelize.TEXT,
  qty: Sequelize.INTEGER
});

var PiecePurchaseOrder = orm.define('PiecePurchaseOrder', {
  notes: Sequelize.TEXT,
  qty: Sequelize.INTEGER,
  price: Sequelize.DECIMAL(10,2)
});

var Settings = orm.define('Settings', {
  laborCost: Sequelize.DECIMAL(10,2)
});

var Product = orm.define('Product', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: Sequelize.STRING,
  cost: Sequelize.DECIMAL(10,2),
  msrp: Sequelize.DECIMAL(10,2),
  qtyOnHand: Sequelize.INTEGER,
  qtyOnOrder: Sequelize.INTEGER
});


/* ASSOCIATIONS */

Piece.belongsToMany(Material, { through: 'PieceMaterial' });
Material.belongsToMany(Piece, { through: 'PieceMaterial' });

Material.belongsTo(MaterialType, { as: 'type'});
Piece.belongsTo(PieceType, { as: 'type' });

Material.belongsToMany(MaterialPurchaseOrder, { as: 'PurchaseOrders', through: 'POMaterial', foreignKey: 'PurchaseOrderId' });
MaterialPurchaseOrder.belongsToMany(Material, { through: 'POMaterial'});

Piece.belongsToMany(PiecePurchaseOrder, { as: 'PurchaseOrders', through: 'POPiece', foreignKey: 'PurchaseOrderId' });
PiecePurchaseOrder.belongsToMany(Piece, { through: 'POPiece'});


Material.sync();
Piece.sync();
MaterialType.sync();
PieceType.sync();
MaterialPurchaseOrder.sync();
PiecePurchaseOrder.sync();
Settings.sync();
Product.sync();

module.exports = {
  Material: Material,
  Piece: Piece,
  MaterialType: MaterialType,
  PieceType: PieceType,
  MaterialPurchaseOrder: MaterialPurchaseOrder,
  PiecePurchaseOrder: PiecePurchaseOrder,
  Settings: Settings,
  Product: Product
};

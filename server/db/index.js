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
  description: Sequelize.STRING,
  vendor: Sequelize.STRING,
  costPerInch: Sequelize.DECIMAL(10,2),
  costPerUnit: Sequelize.DECIMAL(10,2),
  qtyOnHand: Sequelize.INTEGER,
  qtyOnOrder: Sequelize.INTEGER
});

var Piece = orm.define('Piece', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: Sequelize.STRING,
  laborTime: Sequelize.INTEGER,
  laborCost: Sequelize.DECIMAL(10,2),
  totalCost: Sequelize.DECIMAL(10,2),
  wholesalePrice: Sequelize.DECIMAL(10,2),
  msrp: Sequelize.DECIMAL(10,2),
  qtyOnHand: Sequelize.INTEGER,
  qtyOnOrder: Sequelize.INTEGER
});

var Product = orm.define('Product', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: Sequelize.STRING,
  cost: Sequelize.DECIMAL(10,2),
  msrp: Sequelize.DECIMAL(10,2),
  qtyOnHand: Sequelize.INTEGER,
  qtyOnOrder: Sequelize.INTEGER
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

/* ASSOCIATIONS */

Piece.belongsToMany(Material, { through: 'PieceMaterial' });
Material.belongsToMany(Piece, { through: 'PieceMaterial' });

Material.belongsToMany(MaterialPurchaseOrder, { as: 'PurchaseOrders', through: 'POMaterial', foreignKey: 'purchaseOrderId' });
MaterialPurchaseOrder.belongsToMany(Material, { through: 'POMaterial'});

Piece.belongsToMany(PiecePurchaseOrder, { as: 'PurchaseOrders', through: 'POPiece', foreignKey: 'purchaseOrderId' });
PiecePurchaseOrder.belongsToMany(Piece, { through: 'POPiece'});


Material.sync();
Piece.sync();
Product.sync();
MaterialPurchaseOrder.sync();
PiecePurchaseOrder.sync();

module.exports = {
  Material: Material,
  Piece: Piece,
  Product: Product,
  MaterialPurchaseOrder: MaterialPurchaseOrder,
  PiecePurchaseOrder: PiecePurchaseOrder
};

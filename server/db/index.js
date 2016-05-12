/* eslint-disable new-cap */
/* global NODE_ENV */
var Sequelize = require('sequelize');

/* CONNECTION */
var orm;
if (NODE_ENV === 'production') {
  orm = new Sequelize('kim', 'root', '', {
    dialect: 'sqlite',
    storage: '/home/jfa/kim_db/kim.sq3'
  });
} else {
  orm = new Sequelize('kim', 'root', '', {
    dialect: 'sqlite',
    storage: '/Users/Janderson/Documents/Projects/kim_db/kim.sq3',
    logging: false
  });
}


/* SCHEMA */

var Material = orm.define('Material', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: false, unique: true },
  costPerUnit: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
  qtyInStock: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var Piece = orm.define('Piece', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: false, unique: true },
  laborTime: { type: Sequelize.INTEGER, defaultValue: 0 },
  totalCost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
  wholesalePrice: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
  msrp: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
  qtyInStock: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var PieceMaterial = orm.define('PieceMaterial', {
  qty: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var MaterialType = orm.define('MaterialType', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  lowStock: { type: Sequelize.INTEGER, defaultValue: 0 },
  unit: { type: Sequelize.STRING }
});

var PieceType = orm.define('PieceType', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  lowStock: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var MaterialPurchaseOrder = orm.define('MaterialPurchaseOrder', {
  metal: Sequelize.STRING,
  instructions: Sequelize.TEXT,
  qty: Sequelize.INTEGER
});

var PiecePurchaseOrder = orm.define('PiecePurchaseOrder', {
  notes: Sequelize.TEXT,
  qty: Sequelize.INTEGER,
  price: Sequelize.DECIMAL(10, 2)
});

var Vendor = orm.define('Vendor', {
  company: { type: Sequelize.STRING, allowNull: false, unique: true },
  address: { type: Sequelize.STRING, unique: true },
  phone: { type: Sequelize.STRING, unique: true },
  email: { type: Sequelize.STRING, unique: true }
});

var Settings = orm.define('Settings', {
  laborCost: Sequelize.DECIMAL(10, 2)
});

var Product = orm.define('Product', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: Sequelize.STRING,
  cost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
  msrp: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
  qtyOnHand: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});


/* ASSOCIATIONS */

Piece.belongsToMany(Material, { through: 'PieceMaterial', foreignKey: 'pieceId' });
Material.belongsToMany(Piece, { through: 'PieceMaterial', foreignKey: 'materialId' });

Material.belongsTo(MaterialType, { as: 'type' });
Piece.belongsTo(PieceType, { as: 'type' });

Material.belongsTo(Vendor, { as: 'vendor' });

Material.belongsToMany(MaterialPurchaseOrder, {
  as: 'PurchaseOrders',
  through: 'POMaterial',
  foreignKey: 'purchaseOrderId'
});

MaterialPurchaseOrder.belongsToMany(Material, { through: 'POMaterial', foreignKey: 'materialId' });

Piece.belongsToMany(PiecePurchaseOrder, {
  as: 'PurchaseOrders',
  through: 'POPiece',
  foreignKey: 'purchaseOrderId'
});

PiecePurchaseOrder.belongsToMany(Piece, { through: 'POPiece', foreignKey: 'pieceId' });


// create tables if they do not already exist
orm.sync();

module.exports = {
  Material,
  MaterialPurchaseOrder,
  MaterialType,
  Piece,
  PieceMaterial,
  PiecePurchaseOrder,
  PieceType,
  Product,
  Settings,
  Vendor
};

var Sequelize = require('sequelize');

/* CONNECTION */

var dbURL = process.env.DATABASE_URL;

if (dbURL) {
  var orm = new Sequelize(dbURL);
} else {
  var orm = new Sequelize('kim', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  });
}


/* SCHEMA */

var Material = orm.define('Material', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: false, unique: true },
  costPerUnit: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
  qtyInStock: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var Piece = orm.define('Piece', {
  item: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: false, unique: true },
  laborTime: { type: Sequelize.INTEGER, defaultValue: 0 },
  totalCost: Sequelize.DECIMAL(10,2),
  wholesalePrice: Sequelize.DECIMAL(10,2),
  msrp: Sequelize.DECIMAL(10,2),
  qtyInStock: { type: Sequelize.INTEGER, defaultValue: 0 },
  qtyOnOrder: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var PieceMaterial = orm.define('PieceMaterial', {
  qty: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var MaterialType = orm.define('MaterialType', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  lowStock: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var PieceType = orm.define('PieceType', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  lowStock: { type: Sequelize.INTEGER, defaultValue: 0 }
});

var MaterialUnit = orm.define('MaterialUnit', {
  unit: { type: Sequelize.STRING, allowNull: false, unique: true }
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

var Vendor = orm.define('Vendor', {
  company: { type: Sequelize.STRING, allowNull: false, unique: true },
  address: { type: Sequelize.STRING, unique: true },
  phone: { type: Sequelize.STRING, unique: true },
  email: { type: Sequelize.STRING, unique: true }
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

Piece.belongsToMany(Material, { through: 'PieceMaterial', foreignKey: 'pieceId' });
Material.belongsToMany(Piece, { through: 'PieceMaterial', foreignKey: 'materialId' });

Material.belongsTo(MaterialType, { as: 'type'});
Piece.belongsTo(PieceType, { as: 'type' });

Material.belongsTo(MaterialUnit, { as: 'unit' });

Material.belongsTo(Vendor, { as: 'vendor' }); // may end up being belongsToMany

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
  Material: Material,
  Piece: Piece,
  PieceMaterial: PieceMaterial,
  MaterialType: MaterialType,
  PieceType: PieceType,
  MaterialUnit: MaterialUnit,
  MaterialPurchaseOrder: MaterialPurchaseOrder,
  PiecePurchaseOrder: PiecePurchaseOrder,
  Vendor: Vendor,
  Settings: Settings,
  Product: Product
};

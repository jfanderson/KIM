var models = require('./index.js');
var Material = models.Material;
var Piece = models.Piece;
var PieceMaterial = models.PieceMaterial;
var MaterialType = models.MaterialType;
var PieceType = models.PieceType;
var MaterialUnit = models.MaterialUnit;
var MaterialPurchaseOrder = models.MaterialPurchaseOrder;
var PiecePurchaseOrder = models.PiecePurchaseOrder;
var Vendor = models.Vendor;
var Settings = models.Settings;
var Product = models.Product;

var settings = {
  laborCost: 15
};

var materialTypes = [
  {
    name: 'casting',
    lowStock: 15
  },
  {
    name: 'stone',
    lowStock: 5
  },
  {
    name: 'chain',
    lowStock: 10
  },
  {
    name: 'finding',
    lowStock: 10
  }
];

var materialUnits = [
  {
    unit: 'piece'
  },
  {
    unit: 'inch'
  }
];

var vendors = [
  {
    company: 'Yakutum',
    address: '111 8th St',
    phone: '999-999-9999',
    email: 'yak@yak.com'
  }
];

var materials = [
  {
    item: 'F01',
    description: '8mm heishi disc',
    costPerUnit: 2.35,
    qtyInStock: 33
  },
  {
    item: 'CH04',
    description: 'gold chain',
    costPerUnit: 32.20,
    qtyInStock: 14
  },
  {
    item: 'S12',
    description: 'medium labradorite',
    costPerUnit: 11.98,
    qtyInStock: 13
  },
  {
    item: 'C08',
    description: 'silver casting',
    costPerUnit: 9.99,
    qtyInStock: 16
  },
  {
    item: 'F03',
    description: '12mm disc',
    costPerUnit: 4.44,
    qtyInStock: 22
  }
];

var pieceTypes = [
  {
    name: 'necklace',
    lowStock: 5
  },
  {
    name: 'earring',
    lowStock: 5
  },
  {
    name: 'bracelet',
    lowStock: 5
  },
  {
    name: 'ring',
    lowStock: 5
  },
  {
    name: 'other',
    lowStock: 5
  }
];

var pieces = [
  {
    item: 'N001',
    description: 'Valor Necklace',
    totalCost: 10,
    wholesalePrice: 20,
    msrp: 50,
    qtyInStock: 20
  },
  {
    item: 'E001',
    description: 'Facade Earrings',
    totalCost: 8,
    wholesalePrice: 15,
    msrp: 40,
    qtyInStock: 12
  },
  {
    item: 'B001',
    description: 'Cosmic Cuff',
    totalCost: 15,
    wholesalePrice: 30,
    msrp: 70,
    qtyInStock: 8
  },
  {
    item: 'R001',
    description: 'Eclipse Ring',
    totalCost: 20,
    wholesalePrice: 40,
    msrp: 80,
    qtyInStock: 3
  },
  {
    item: 'N006',
    description: 'Mayan Necklace',
    totalCost: 30,
    wholesalePrice: 60,
    msrp: 1500,
    qtyInStock: 5
  }
];

console.log('Writing to database...');

Settings.create(settings).then(() => {
  return MaterialType.bulkCreate(materialTypes);
}).then(() => {
  return MaterialUnit.bulkCreate(materialUnits);
}).then(() => {
  return Vendor.bulkCreate(vendors);
}).then(() => {
  return Material.bulkCreate(materials);
}).then(() => {
  return PieceType.bulkCreate(pieceTypes);
}).then(() => {
  return Piece.bulkCreate(pieces);
}).then(() => {
  console.log('Done!');
}).catch(error => {
  console.log('Error: ', error);
});

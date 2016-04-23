let models = require('./index.js');
let Material = models.Material;
let Piece = models.Piece;
let MaterialType = models.MaterialType;
let PieceType = models.PieceType;
let Vendor = models.Vendor;
let Settings = models.Settings;

let settings = {
  laborCost: 15
};

let materialTypes = [
  {
    name: 'none'
  },
  {
    name: 'casting',
    lowStock: 15
  },
  {
    name: 'stone',
    lowStock: 5,
    unit: 'piece'
  },
  {
    name: 'chain',
    lowStock: 10,
    unit: 'inch'
  },
  {
    name: 'finding',
    lowStock: 10
  }
];

let vendors = [
  {
    company: 'Yakutum',
    address: '111 8th St',
    phone: '999-999-9999',
    email: 'yak@yak.com'
  },
  {
    company: 'Acme, Inc.',
    address: '321 Acme Lane',
    phone: '888-888-1234',
    email: 'ac@me.com'
  }
];

let materials = [
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

let pieceTypes = [
  {
    name: 'none'
  },
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

let pieces = [
  {
    item: 'N001',
    description: 'Valor Necklace',
    wholesalePrice: 20,
    msrp: 50,
    qtyInStock: 20
  },
  {
    item: 'E001',
    description: 'Facade Earrings',
    wholesalePrice: 15,
    msrp: 40,
    qtyInStock: 12
  },
  {
    item: 'B001',
    description: 'Cosmic Cuff',
    wholesalePrice: 30,
    msrp: 70,
    qtyInStock: 8
  },
  {
    item: 'R001',
    description: 'Eclipse Ring',
    wholesalePrice: 40,
    msrp: 80,
    qtyInStock: 3
  },
  {
    item: 'N006',
    description: 'Mayan Necklace',
    wholesalePrice: 60,
    msrp: 1500,
    qtyInStock: 5
  }
];

console.log('Writing to database...');

Settings.create(settings).then(() =>
  MaterialType.bulkCreate(materialTypes)
).then(() =>
  Vendor.bulkCreate(vendors)
).then(() =>
  Material.bulkCreate(materials)
).then(() =>
  PieceType.bulkCreate(pieceTypes)
).then(() =>
  Piece.bulkCreate(pieces)
).then(() => {
  console.log('Done!');
}).catch(error => {
  console.log('Error: ', error);
});

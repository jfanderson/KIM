/* eslint-disable */
var request = require('supertest');
var expect = require('chai').expect;

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Material = models.Material;
var MaterialType = models.MaterialType;
var Vendor = models.Vendor;
var Contractor = models.Contractor;
var ContractorMaterial = models.ContractorMaterial;

describe('Material Tests', function() {

  beforeEach(function(done) {
    var materialId;

    var newTypes = [
      { name: 'fakeType', lowStock: 5, unit: 'fakeUnit' },
      { name: 'fakeType2' }
    ];

    var newVendors = [
      { company: 'fakeVendor'},
      { company: 'fakeVendor2'}
    ];

    MaterialType.bulkCreate(newTypes).then(function() {
      return Vendor.bulkCreate(newVendors);
    }).then(function() {
      done();
    });
  });

  afterEach(function(done) {
    MaterialType.destroy({
      where: {
        name: {
          $in: ['fakeType', 'fakeType2']
        }
      }
    }).then(function() {
      return Vendor.destroy({
        where: {
          company: {
            $in: ['fakeVendor', 'fakeVendor2']
          }
        }
      });
    }).then(function() {
      done();
    });
  });

  describe('Material pathways: ', function() {

    it('should add a material', function(done) {
      request(app)
        .post('/a/materials')
        .send({ material: {
            item: 'Z000',
            description: 'fake material'
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.material).to.have.property('item', 'Z000');
          materialId = res.body.material.id;
        })
        .end(function() {
          Material.findOne({ where: { item: 'Z000' }}).then(function(material) {
            expect(material).to.be.ok;
            done();
          });
        });
    });

    it('should retrieve a single material', function(done) {
      request(app)
        .get('/a/materials/' + materialId)
        .expect(200)
        .expect(function(res) {
          expect(res.body.material.description).to.equal('fake material');
        })
        .end(done);
    });

    it('should retrieve all materials', function(done) {
      request(app)
        .get('/a/materials')
        .expect(200)
        .expect(function(res) {
          expect(res.body.materials).to.have.length.above(0);
          expect(Array.isArray(res.body.materials)).to.be.true;
          expect(res.body.materials[0]).to.have.property('item');
        })
        .end(done);
    });

    it('should modify a material', function(done) {
      request(app)
        .put('/a/materials/' + materialId)
        .send({
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.material).to.have.property('description', 'new description');
        })
        .end(function() {
          Material.findOne({ where: { item: 'Z000' }}).then(function(material) {
            expect(material.description).to.equal('new description');
            done();
          });
        });
    });

    it('should associate a material with a type and vendor', function(done) {
      request(app)
        .put('/a/materials/' + materialId)
        .send({
          type: 'fakeType',
          vendor: 'fakeVendor'
        })
        .expect(200)
        .end(function(err, res) {
          MaterialType.findById(res.body.material.typeId).then(function(type) {
            expect(type.name).to.equal('fakeType');
            expect(type.unit).to.equal('fakeUnit');

            return Vendor.findById(res.body.material.vendorId);
          }).then(function(vendor) {
            expect(vendor.company).to.equal('fakeVendor');
            done();
          });
        });
    });

    it('should modify a materials type and vendor', function(done) {
      request(app)
        .put('/a/materials/' + materialId)
        .send({
          type: 'fakeType2',
          vendor: 'fakeVendor2',
          description: 'new description'
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.material.description).to.equal('new description');

          MaterialType.findById(res.body.material.typeId).then(function(type) {
            expect(type.name).to.equal('fakeType2');

            return Vendor.findById(res.body.material.vendorId);
          }).then(function(vendor) {
            expect(vendor.company).to.equal('fakeVendor2');
            done();
          });
        });
    });

    it('should automatically associate a new contractor with a material', function(done) {
      request(app)
        .post('/a/contractors')
        .send({ contractor: {
            name: 'test name'
          }
        })
        .expect(201)
        .expect(function(res) {
          contractorId = res.body.contractor.id;
        })
        .end(function() {
          ContractorMaterial.findOne({
            where: {
              contractorId: contractorId,
              materialId: materialId
            }
          }).then(function(result) {
            expect(result).to.be.ok;
            expect(result.qty).to.equal(0);
            done();
          });
        });
    });

    after(function(done) {
      Contractor.destroy({ where: { id: contractorId }}).then(function() {
        done();
      });
    });

    it('should remove a material', function(done) {
      request(app)
        .delete('/a/materials/' + materialId)
        .expect(204)
        .end(function(err, res) {
          Material.findOne({ where: { item: 'Z000' }}).then(function(material) {
            expect(material).to.not.be.ok;
            done();
          });
        });
    });
  });
});

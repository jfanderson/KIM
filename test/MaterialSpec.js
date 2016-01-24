var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Material = models.Material;
var MaterialType = models.MaterialType;
var MaterialUnit = models.MaterialUnit;
var Vendor = models.Vendor;

describe('Material Tests', function() {

  beforeEach(function(done) {
    var materialId;
    var materialId2;

    var newTypes = [
      { name: 'fakeType', lowStock: 5 },
      { name: 'fakeType2' }
    ];

    var newUnits = [
      { unit: 'fakeUnit'},
      { unit: 'fakeUnit2'}
    ];

    var newVendors = [
      { company: 'fakeVendor'},
      { company: 'fakeVendor2'}
    ];

    MaterialType.bulkCreate(newTypes).then(function() {
      return MaterialUnit.bulkCreate(newUnits);
    }).then(function() {
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
      return MaterialUnit.destroy({
        where: {
          unit: {
            $in: ['fakeUnit', 'fakeUnit2']
          }
        }
      });
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

    it('should associate a new material with a type, unit, and vendor', function(done) {
      request(app)
        .post('/a/materials')
        .send({ material: {
            item: 'Z001',
            description: 'another fake material',
            type: 'fakeType',
            unit: 'fakeUnit',
            vendor: 'fakeVendor'
          }
        })
        .end(function(err, res) {
          materialId2 = res.body.material.id;

          MaterialType.findById(res.body.material.typeId).then(function(type) {
            expect(type.name).to.equal('fakeType');

            return MaterialUnit.findById(res.body.material.unitId);
          }).then(function(unit) {
            expect(unit.unit).to.equal('fakeUnit');

            return Vendor.findById(res.body.material.vendorId);
          }).then(function(vendor) {
            expect(vendor.company).to.equal('fakeVendor');
            done();
          });
        });
    });

    after(function(done) {
      Material.findOne({ where: { item: 'Z001' }}).then(function(material) {
        return material.destroy();
      }).then(function() {
        done();
      });
    });

    it('should modify a materials type, unit, and vendor', function(done) {
      request(app)
        .put('/a/materials/' + materialId2)
        .send({
          type: 'fakeType2',
          unit: 'fakeUnit2',
          vendor: 'fakeVendor2',
          description: 'new description'
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.material.description).to.equal('new description');

          MaterialType.findById(res.body.material.typeId).then(function(type) {
            expect(type.name).to.equal('fakeType2');

            return MaterialUnit.findById(res.body.material.unitId);
          }).then(function(unit) {
            expect(unit.unit).to.equal('fakeUnit2');

            return Vendor.findById(res.body.material.vendorId);
          }).then(function(vendor) {
            expect(vendor.company).to.equal('fakeVendor2');
            done();
          });
        });
    });

  });
});

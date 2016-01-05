var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Material = models.Material;
var MaterialType = models.MaterialType;

describe('Material Tests', function() {

  beforeEach(function(done) {
    var newTypes = [
      { name: 'fake', lowStock: 5 },
      { name: 'fake2' }
    ];

    MaterialType.bulkCreate(newTypes).then(function() {
      done();
    });
  });

  afterEach(function(done) {
    MaterialType.findOne({ where: { name: 'fake' }}).then(function(type) {
      return type.destroy();
    }).then(function() {
      MaterialType.findOne({ where: { name: 'fake2' }}).then(function(type) {
        return type.destroy();
      }).then(function() {
        done();
      });
    });
  });

  describe('Material pathways: ', function() {

    it('should add a material', function(done) {
      request(app)
        .post('/materials')
        .send({ material: {
            item: 'Z000',
            description: 'fake material'
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.material).to.have.property('item', 'Z000');

          Material.findOne({ where: { item: 'Z000' }}).then(function(material) {
            expect(material).to.be.ok;
          });
        })
        .end(done);
    });

    it('should retrieve a single material', function(done) {
      request(app)
        .get('/materials/Z000')
        .expect(200)
        .expect(function(res) {
          expect(res.body.material.description).to.equal('fake material');
        })
        .end(done);
    });

    it('should retrieve all materials', function(done) {
      request(app)
        .get('/materials')
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
        .put('/materials/Z000')
        .send({
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.material).to.have.property('description', 'new description');

          Material.findOne({ where: { item: 'Z000' }}).then(function(material) {
            expect(material.description).to.equal('new description');
          });
        })
        .end(done);
    });

    it('should remove a material', function(done) {
      request(app)
        .delete('/materials/Z000')
        .expect(204)
        .expect(function(res) {
          Material.findOne({ where: { item: 'Z000' }}).then(function(material) {
            expect(material).to.not.be.ok;
          });
        })
        .end(done);
    });

    it('should associate a new material with a type', function(done) {
      request(app)
        .post('/materials')
        .send({ material: {
            item: 'Z001',
            description: 'another fake material',
            type: 'fake'
          }
        })
        .expect(function(res) {
          MaterialType.findById(res.body.material.typeId).then(function(type) {
            expect(type.name).to.equal('fake');
          });
        })
        .end(done);
    });

    after(function(done) {
      Material.findOne({ where: { item: 'Z001' }}).then(function(material) {
        return material.destroy();
      }).then(function() {
        done();
      });
    });

    it('should modify a materials type', function(done) {
      request(app)
        .put('/materials/Z001')
        .send({
          type: 'fake2',
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.material.description).to.equal('new description');

          MaterialType.findById(res.body.material.typeId).then(function(type) {
            expect(type.name).to.equal('fake2');
          });
        })
        .end(done);
    });

  });
});

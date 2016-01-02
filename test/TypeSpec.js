var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var PieceType = models.PieceType;
var MaterialType = models.MaterialType;

describe('Type Tests', function() {

  beforeEach(function(done) {
    var newType = {
      name: 'testPieceType',
      lowStock: 3
    };

    var newType2 = {
      name: 'testMaterialType'
    };

    PieceType.create(newType).then(function() {
      MaterialType.create(newType2).then(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    PieceType.findOne({ where: { name: 'testPieceType' }}).then(function(type) {
      return type.destroy();
    }).then(function() {
      MaterialType.findOne({ where: { name: 'testMaterialType'}}).then(function(type) {
        return type.destroy();
      }).then(function() {
        done();
      });
    });
  });

  describe('Piece and material type pathways: ', function() {

    it('should retrieve all piece types', function(done) {
      request(app)
        .get('/types/pieces')
        .expect(200)
        .expect(function(res) {
          expect(res.body.types).to.have.length.above(0);
          expect(Array.isArray(res.body.types)).to.be.true;
          expect(res.body.types[0].lowStock).to.be.at.least(0);
        })
        .end(done);
    });

    it('should retrieve all material types', function(done) {
      request(app)
        .get('/types/materials')
        .expect(200)
        .expect(function(res) {
          expect(res.body.types).to.have.length.above(0);
          expect(Array.isArray(res.body.types)).to.be.true;
          expect(res.body.types[0].lowStock).to.be.at.least(0);
        })
        .end(done);
    });

    it('should add a piece type', function(done) {
      request(app)
        .post('/types/pieces')
        .send({ type: {
            name: 'fakeType',
            lowStock: 10
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.type).to.have.property('lowStock', 10);

          PieceType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.be.ok;
          });
        })
        .end(done);
    });

    it('should add a material type', function(done) {
      request(app)
        .post('/types/materials')
        .send({ type: {
            name: 'fakeType',
            lowStock: 10
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.type).to.have.property('lowStock', 10);

          MaterialType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.be.ok;
          });
        })
        .end(done);
    });

    it('should modify a piece type', function(done) {
      request(app)
        .put('/types/pieces/fakeType')
        .send({
          lowStock: 2
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.type).to.have.property('lowStock', 2);

          PieceType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type.lowStock).to.equal(2);
          });
        })
        .end(done);
    });

    it('should modify a material type', function(done) {
      request(app)
        .put('/types/materials/fakeType')
        .send({
          lowStock: 2
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.type).to.have.property('lowStock', 2);

          MaterialType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type.lowStock).to.equal(2);
          });
        })
        .end(done);
    });

    it('should remove a piece type', function(done) {
      request(app)
        .delete('/types/pieces/fakeType')
        .expect(204)
        .expect(function(res) {
          PieceType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.not.be.ok;
          });
        })
        .end(done);
    });

    it('should remove a material type', function(done) {
      request(app)
        .delete('/types/materials/fakeType')
        .expect(204)
        .expect(function(res) {
          MaterialType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.not.be.ok;
          });
        })
        .end(done);
    });

  });
});

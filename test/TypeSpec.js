var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var PieceType = models.PieceType;
var MaterialType = models.MaterialType;

describe('Type Tests', function() {
  var pieceTypeId;
  var materialTypeId;

  describe('Piece and material type pathways: ', function() {

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
          pieceTypeId = res.body.type.id;
          expect(res.body.type).to.have.property('lowStock', 10);
        })
        .end(function() {
          PieceType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.be.ok;
            done();
          });
        });
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
          materialTypeId = res.body.type.id;
          expect(res.body.type).to.have.property('lowStock', 10);
        })
        .end(function() {
          MaterialType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.be.ok;
            done();
          });
        });
    });

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

    it('should modify a piece type', function(done) {
      request(app)
        .put('/types/pieces/' + pieceTypeId)
        .send({
          lowStock: 2
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.type).to.have.property('lowStock', 2);
        })
        .end(function() {
          PieceType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type.lowStock).to.equal(2);
            done();
          });
        });
    });

    it('should modify a material type', function(done) {
      request(app)
        .put('/types/materials/' + materialTypeId)
        .send({
          lowStock: 2
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.type).to.have.property('lowStock', 2);
        })
        .end(function() {
          MaterialType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type.lowStock).to.equal(2);
            done();
          });
        });
    });

    it('should remove a piece type', function(done) {
      request(app)
        .delete('/types/pieces/' + pieceTypeId)
        .expect(204)
        .end(function() {
          PieceType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.not.be.ok;
            done();
          });
        });
    });

    it('should remove a material type', function(done) {
      request(app)
        .delete('/types/materials/' + materialTypeId)
        .expect(204)
        .end(function() {
          MaterialType.findOne({ where: { name: 'fakeType' }}).then(function(type) {
            expect(type).to.not.be.ok;
            done();
          });
        });
    });

  });
});

var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Piece = models.Piece;

describe('Piece Tests', function() {

  beforeEach(function(done) {
    var newPiece = {
      item: 'Z000',
      description: 'not a real piece',
      laborTime: 10,
      qtyOnHand: 5
    };

    Piece.create(newPiece).then(function(piece) {
      done();
    });
  });

  afterEach(function(done) {
    Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
      return piece.destroy();
    }).then(function() {
      done();
    });
  });

  describe('Jewelry piece pathways: ', function() {

    it('should retrieve all pieces', function(done) {
      request(app)
        .get('/pieces')
        .expect(200)
        .expect(function(res) {
          expect(res.body.pieces).to.have.length.above(0);
          expect(Array.isArray(res.body.pieces)).to.be.true;
          expect(res.body.pieces[0]).to.have.property('item');
        })
        .end(done);
    });

    it('should add a piece', function(done) {
      request(app)
        .post('/pieces')
        .send({ piece: {
            item: 'Z001',
            description: 'another fake'
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.piece).to.have.property('item', 'Z001');

          Piece.findOne({ where: { item: 'Z001' }}).then(function(piece) {
            expect(piece).to.be.ok;
          });
        })
        .end(done);
    });

    it('should modify a piece', function(done) {
      request(app)
        .put('/pieces/Z001')
        .send({
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece).to.have.property('description', 'new description');

          Piece.findOne({ where: { item: 'Z001' }}).then(function(piece) {
            expect(piece.description).to.equal('new description');
          });
        })
        .end(done);
    });

    it('should remove a piece', function(done) {
      request(app)
        .delete('/pieces/Z001')
        .expect(204)
        .expect(function(res) {
          Piece.findOne({ where: { item: 'Z001' }}).then(function(piece) {
            expect(piece).to.not.be.ok;
          });
        })
        .end(done);
    });

  });
});

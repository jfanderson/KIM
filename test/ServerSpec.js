var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Piece = models.Piece;

describe('Server Tests', function() {

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
          expect(res.body).to.have.length.above(0);
        })
        .end(done);
    });

  });
});

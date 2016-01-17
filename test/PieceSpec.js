var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Piece = models.Piece;
var PieceType = models.PieceType;

describe('Piece Tests', function() {

  beforeEach(function(done) {
    var pieceId;
    var pieceId2;

    var newTypes = [
      { name: 'fake', lowStock: 5 },
      { name: 'fake2' }
    ];

    PieceType.bulkCreate(newTypes).then(function() {
      done();
    });
  });

  afterEach(function(done) {
    PieceType.findOne({ where: { name: 'fake' }}).then(function(type) {
      return type.destroy();
    }).then(function() {
      PieceType.findOne({ where: { name: 'fake2' }}).then(function(type) {
        return type.destroy();
      }).then(function() {
        done();
      });
    });
  });

  describe('Jewelry piece pathways: ', function() {

    it('should add a piece', function(done) {
      request(app)
        .post('/pieces')
        .send({ piece: {
            item: 'Z000',
            description: 'fake piece'
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.piece).to.have.property('item', 'Z000');

          Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
            pieceId = piece.id;

            expect(piece).to.be.ok;
          });
        })
        .end(done);
    });

    it('should retrieve a single piece', function(done) {
      request(app)
        .get('/pieces/' + pieceId)
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece.description).to.equal('fake piece');
        })
        .end(done);
    });

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

    it('should modify a piece', function(done) {
      request(app)
        .put('/pieces/' + pieceId)
        .send({
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece).to.have.property('description', 'new description');

          Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
            expect(piece.description).to.equal('new description');
          });
        })
        .end(done);
    });

    it('should remove a piece', function(done) {
      request(app)
        .delete('/pieces/' + pieceId)
        .expect(204)
        .expect(function(res) {
          Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
            expect(piece).to.not.be.ok;
          });
        })
        .end(done);
    });

    it('should associate a new piece with a type', function(done) {
      request(app)
        .post('/pieces')
        .send({ piece: {
            item: 'Z001',
            description: 'another fake piece',
            type: 'fake'
          }
        })
        .expect(function(res) {
          pieceId2 = res.body.piece.id;

          PieceType.findById(res.body.piece.typeId).then(function(type) {
            expect(type.name).to.equal('fake');
          });
        })
        .end(done);
    });

    after(function(done) {
      Piece.findOne({ where: { item: 'Z001' }}).then(function(piece) {
        return piece.destroy();
      }).then(function() {
        done();
      });
    });

    it('should modify a pieces type', function(done) {
      request(app)
        .put('/pieces/' + pieceId2)
        .send({
          type: 'fake2',
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece.description).to.equal('new description');

          PieceType.findById(res.body.piece.typeId).then(function(type) {
            expect(type.name).to.equal('fake2');
          });
        })
        .end(done);
    });

  });
});

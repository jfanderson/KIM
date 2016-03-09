var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Piece = models.Piece;
var PieceType = models.PieceType;
var Material = models.Material;
var PieceMaterial = models.PieceMaterial;

describe('Piece Tests', function() {
  var pieceId;
  var pieceId2;
  var materialId;

  before(function(done) {

    var newTypes = [
      { name: 'fake', lowStock: 5 },
      { name: 'fake2' }
    ];

    PieceType.bulkCreate(newTypes).then(function() {
      done();
    });
  });

  after(function(done) {
    PieceType.destroy({
      where: {
        name: {
          $in: ['fake', 'fake2']
        }
      }
    }).then(function() {
      return Piece.destroy({ where: { id: pieceId2 } });
    }).then(function() {
      done();
    });
  });

  describe('Jewelry piece pathways: ', function() {

    it('should add a piece', function(done) {
      request(app)
        .post('/a/pieces')
        .send({ piece: {
            item: 'Z000',
            description: 'fake piece'
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.piece).to.have.property('item', 'Z000');
          pieceId = res.body.piece.id;
        })
        .end(function() {
          return Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
            expect(piece).to.be.ok;
            done();
          });
        });
    });

    it('should retrieve a single piece', function(done) {
      request(app)
        .get('/a/pieces/' + pieceId)
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece.description).to.equal('fake piece');
        })
        .end(done);
    });

    it('should retrieve all pieces', function(done) {
      request(app)
        .get('/a/pieces')
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
        .put('/a/pieces/' + pieceId)
        .send({
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece).to.have.property('description', 'new description');
        })
        .end(function() {
          Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
            expect(piece.description).to.equal('new description');
            done();
          });
        });
    });

    it('should remove a piece', function(done) {
      request(app)
        .delete('/a/pieces/' + pieceId)
        .expect(204)
        .end(function() {
          Piece.findOne({ where: { item: 'Z000' }}).then(function(piece) {
            expect(piece).to.not.be.ok;
            done();
          });
        });
    });

    it('should associate a new piece with a type', function(done) {
      request(app)
        .post('/a/pieces')
        .send({ piece: {
            item: 'Z001',
            description: 'another fake piece',
            type: 'fake'
          }
        })
        .expect(function(res) {
          pieceId2 = res.body.piece.id;
        })
        .end(function(err, res) {
          PieceType.findById(res.body.piece.typeId).then(function(type) {
            expect(type.name).to.equal('fake');
            done();
          });
        });
    });

    it('should modify a pieces type', function(done) {
      request(app)
        .put('/a/pieces/' + pieceId2)
        .send({
          type: 'fake2',
          description: 'new description'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.piece.description).to.equal('new description');
        })
        .end(function(err, res) {
          PieceType.findById(res.body.piece.typeId).then(function(type) {
            expect(type.name).to.equal('fake2');
            done();
          });
        });
    });

    before(function(done) {
      Material.create({
        item: 'test',
        description: 'testMaterial',
        qtyInStock: 20
      }).then(function(material) {
        materialId = material.id;
        done();
      });
    });

    it('should associate a material with a piece', function(done) {
      request(app)
        .post('/a/pieces/' + pieceId2 + '/material/' + materialId)
        .expect(200)
        .end(function() {
          PieceMaterial.findOne({
            where: {
              pieceId: pieceId2,
              materialId: materialId
            }
          }).then(function(result) {
            expect(result).to.be.ok;
            done();
          });
        });
    });

    it('should modify the quantity of a material used to make the piece', function(done) {
      request(app)
        .put('/a/pieces/' + pieceId2 + '/material/' + materialId)
        .send({ qty: 5 })
        .expect(200)
        .end(function() {
          PieceMaterial.findOne({
            where: {
              pieceId: pieceId2,
              materialId: materialId
            }
          }).then(function(result) {
            expect(result.qty).to.equal(5);
            done();
          });
        });
    });

    it('should update material stock numbers when pieces are made', function(done) {
      request(app)
        .put('/a/pieces/' + pieceId2)
        .send({ qtyInStock: 2 })
        .expect(200)
        .end(function() {
          Material.findById(materialId).then(function(material) {
            Piece.findById(pieceId2).then(function(piece) {
              expect(material.qtyInStock).to.equal(10);
              expect(piece.qtyInStock).to.equal(2);
              done();
            });
          });
        });
    });

    after(function(done) {
      Material.destroy({ where: { id: materialId }}).then(function() {
        done();
      });
    });

    it('should disassociate a material from a piece', function(done) {
      request(app)
        .delete('/a/pieces/' + pieceId2 + '/material/' + materialId)
        .expect(204)
        .end(function() {
          PieceMaterial.findOne({
            where: {
              pieceId: pieceId2,
              materialId: materialId
            }
          }).then(function(result) {
            expect(result).to.not.be.ok;
            done();
          });
        });
    });

  });
});

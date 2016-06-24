/* eslint-disable */
var request = require('supertest');
var expect = require('chai').expect;

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Contractor = models.Contractor;
var Material = models.Material;
var ContractorMaterial = models.ContractorMaterial;
var Piece = models.Piece;

describe('Contractor', function() {
  var contractorId;
  var materialId;
  var pieceId;

  after(function(done) {
    Material.destroy({ where: { id: materialId }}).then(function() {
      Piece.destroy({ where: { id: pieceId }}).then(function() {
        done();
      });
    });
  });

  it('should be created', function(done) {
    request(app)
      .post('/a/contractors')
      .send({ contractor: {
          name: 'test name'
        }
      })
      .expect(201)
      .expect(function(res) {
        expect(res.body.contractor).to.have.property('name', 'test name');
        contractorId = res.body.contractor.id;
      })
      .end(function() {
        return Contractor.findOne({ where: { name: 'test name' }}).then(function(contractor) {
          expect(contractor).to.be.ok;
          done();
        });
      });
  });

  it('should be retrievable (single)', function(done) {
    request(app)
      .get('/a/contractors/' + contractorId)
      .expect(200)
      .expect(function(res) {
        expect(res.body.contractor.name).to.equal('test name');
      })
      .end(done);
  });

  it('should be retrievable (multiple)', function(done) {
    request(app)
      .get('/a/contractors')
      .expect(200)
      .expect(function(res) {
        expect(res.body.contractors).to.have.length.above(0);
        expect(Array.isArray(res.body.contractors)).to.be.true;
        expect(res.body.contractors[0]).to.have.property('name');
      })
      .end(done);
  });

  it('should be modifiable', function(done) {
    request(app)
      .put('/a/contractors/' + contractorId)
      .send({
        name: 'new name'
      })
      .expect(200)
      .expect(function(res) {
        expect(res.body.contractor).to.have.property('name', 'new name');
      })
      .end(function() {
        Contractor.findOne({ where: { name: 'new name' }}).then(function(contractor) {
          expect(contractor).to.be.ok;
          done();
        });
      });
  });

  it('should be automatically associated with a new material', function(done) {
    request(app)
      .post('/a/materials')
      .send({ material: {
          item: 'test',
          description: 'testMaterial',
          qtyInStock: 20
        }
      })
      .expect(201)
      .expect(function(res) {
        materialId = res.body.material.id;
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

          // Make new piece and link it with this material.
          var newPiece = {
            item: 'blah',
            description: 'fake piece',
            qtyInStock: 1
          };

          Piece.create(newPiece).then(function(piece) {
            pieceId = piece.id;

            piece.addMaterial(materialId, { qty: 4 }).then(function() {
              done();
            });
          });
        });
      });
  });

  it('should receive materials from store stock', function(done) {
    request(app)
      .put('/a/contractors/' + contractorId + '/material/' + materialId)
      .send({ qty: 5 })
      .expect(200)
      .end(function() {
        ContractorMaterial.findOne({
          where: {
            contractorId: contractorId,
            materialId: materialId
          }
        }).then(function(result) {
          expect(result.qty).to.equal(5);

          Material.findById(materialId).then(function(material) {
            expect(material.qtyInStock).to.equal(15);
            done();
          });
        });
      });
  });

  it('should have reduced stock after transferring pieces to store', function(done) {
    request(app)
      .put('/a/contractors/' + contractorId + '/piece/' + pieceId)
      .send({ qty: 1 })
      .expect(200)
      .end(function() {
        ContractorMaterial.findOne({
          where: {
            contractorId: contractorId,
            materialId: materialId
          }
        }).then(function(result) {
          expect(result.qty).to.equal(1);

          Piece.findById(pieceId).then(function(piece) {
            expect(piece.qtyInStock).to.equal(2);
            done();
          });
        });
      });
  });

  it('should be removable', function(done) {
    request(app)
    .delete('/a/contractors/' + contractorId)
    .expect(204)
    .end(function() {
      Contractor.findOne({ where: { name: 'new name' }}).then(function(contractor) {
        expect(contractor).to.not.be.ok;
        done();
      });
    });
  });
});

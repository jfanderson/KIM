/* eslint-disable */
var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Contractor = models.Contractor;
var Material = models.Material;
var ContractorMaterial = models.ContractorMaterial;

describe('Contractor Tests', function() {
  var contractorId;
  var materialId;

  describe('Contractor pathways: ', function() {

    it('should add a contractor', function(done) {
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

    it('should retrieve a single contractor', function(done) {
      request(app)
        .get('/a/contractors/' + contractorId)
        .expect(200)
        .expect(function(res) {
          expect(res.body.contractor.name).to.equal('test name');
        })
        .end(done);
    });

    it('should retrieve all contractors', function(done) {
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

    it('should modify a contractor', function(done) {
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

    it('should associate a material with a contractor', function(done) {
      request(app)
        .post('/a/contractors/' + contractorId + '/material/' + materialId)
        .send({ qty: 10 })
        .expect(200)
        .end(function() {
          ContractorMaterial.findOne({
            where: {
              contractorId: contractorId,
              materialId: materialId
            }
          }).then(function(result) {
            expect(result).to.be.ok;
            expect(result.qty).to.equal(10);
            done();
          });
        });
    });

    it('should modify the quantity of a material stored with a contractor', function(done) {
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
            done();
          });
        });
    });

    after(function(done) {
      Material.destroy({ where: { id: materialId }}).then(function() {
        done();
      });
    });

    it('should disassociate a material from a contractor', function(done) {
      request(app)
        .delete('/a/contractors/' + contractorId + '/material/' + materialId)
        .expect(204)
        .end(function() {
          ContractorMaterial.findOne({
            where: {
              contractorId: contractorId,
              materialId: materialId
            }
          }).then(function(result) {
            expect(result).to.not.be.ok;
            done();
          });
        });
    });

    it('should remove a contractor', function(done) {
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
});

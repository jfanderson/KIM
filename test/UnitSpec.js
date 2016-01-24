var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var MaterialUnit = models.MaterialUnit;

describe('Material Unit Tests', function() {
  var unitId;

  describe('Material unit pathways: ', function() {

    it('should add a unit', function(done) {
      request(app)
        .post('/a/units/material')
        .send({
          unit: {
            unit: 'test'
          }
        })
        .expect(201)
        .expect(function(res) {
          unitId = res.body.unit.id;
          expect(res.body.unit).to.have.property('unit', 'test');
        })
        .end(function() {
          MaterialUnit.findOne({ where: { unit: 'test' }}).then(function(unit) {
            expect(unit).to.be.ok;
            done();
          });
        });
    });

    it('should retrieve all units', function(done) {
      request(app)
        .get('/a/units/material')
        .expect(200)
        .expect(function(res) {
          expect(res.body.units).to.have.length.above(0);
          expect(Array.isArray(res.body.units)).to.be.true;
          expect(res.body.units[0].unit).to.be.at.ok;
        })
        .end(done);
    });

    it('should remove a unit', function(done) {
      request(app)
        .delete('/a/units/material/' + unitId)
        .expect(204)
        .end(function() {
          MaterialUnit.findOne({ where: { unit: 'test' }}).then(function(unit) {
            expect(unit).to.not.be.ok;
            done();
          });
        });
    });
  });
});

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
        .post('/units/material')
        .send({
          unit: {
            unit: 'test'
          }
        })
        .expect(201)
        .expect(function(res) {
          unitId = res.body.unit.id;

          expect(res.body.unit).to.have.property('unit', 'test');

          MaterialUnit.findOne({ where: { unit: 'test' }}).then(function(unit) {
            expect(unit).to.be.ok;
          });
        })
        .end(done);
    });

    it('should retrieve all units', function(done) {
      request(app)
        .get('/units/material')
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
        .delete('/units/material/' + unitId)
        .expect(204)
        .expect(function(res) {
          MaterialUnit.findOne({ where: { unit: 'test' }}).then(function(unit) {
            expect(unit).to.not.be.ok;
          });
        })
        .end(done);
    });
  });
});

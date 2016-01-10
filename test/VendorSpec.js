var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Vendor = models.Vendor;

describe('Vendor Tests', function() {

  describe('Vendor pathways: ', function() {

    it('should add a vendor', function(done) {
      request(app)
        .post('/vendors')
        .send({ vendor: {
            company: 'test',
            address: 'fake lane',
            phone: '000-111-2222',
            email: 'fake@fake.co'
          }
        })
        .expect(201)
        .expect(function(res) {
          expect(res.body.vendor).to.have.property('address', 'fake lane');

          Vendor.findOne({ where: { company: 'test' }}).then(function(vendor) {
            expect(vendor).to.be.ok;
          });
        })
        .end(done);
    });

    it('should retrieve all vendors', function(done) {
      request(app)
        .get('/vendors')
        .expect(200)
        .expect(function(res) {
          expect(res.body.vendors).to.have.length.above(0);
          expect(Array.isArray(res.body.vendors)).to.be.true;
          expect(res.body.vendors[0].address).to.be.at.ok;
        })
        .end(done);
    });

    it('should modify a vendor', function(done) {
      request(app)
        .put('/vendors/test')
        .send({
          email: 'new@new.com'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.vendor).to.have.property('email', 'new@new.com');

          Vendor.findOne({ where: { company: 'test' }}).then(function(vendor) {
            expect(vendor.email).to.equal('new@new.com');
          });
        })
        .end(done);
    });

    it('should remove a vendor', function(done) {
      request(app)
        .delete('/vendors/test')
        .expect(204)
        .expect(function(res) {
          Vendor.findOne({ where: { company: 'test' }}).then(function(vendor) {
            expect(vendor).to.not.be.ok;
          });
        })
        .end(done);
    });
  });
});

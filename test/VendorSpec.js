var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server/app.js');
var models = require('../server/db/index.js');
var Vendor = models.Vendor;

describe('Vendor Tests', function() {
  var vendorId;

  describe('Vendor pathways: ', function() {

    it('should add a vendor', function(done) {
      request(app)
        .post('/a/vendors')
        .send({ vendor: {
            company: 'test',
            address: 'fake lane',
            phone: '000-111-2222',
            email: 'fake@fake.co'
          }
        })
        .expect(201)
        .expect(function(res) {
          vendorId = res.body.vendor.id;
          expect(res.body.vendor).to.have.property('address', 'fake lane');
        })
        .end(function() {
          Vendor.findOne({ where: { company: 'test' }}).then(function(vendor) {
            expect(vendor).to.be.ok;
            done();
          });
        });
    });

    it('should retrieve all vendors', function(done) {
      request(app)
        .get('/a/vendors')
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
        .put('/a/vendors/' + vendorId)
        .send({
          email: 'new@new.com'
        })
        .expect(200)
        .expect(function(res) {
          expect(res.body.vendor).to.have.property('email', 'new@new.com');
        })
        .end(function() {
          Vendor.findOne({ where: { company: 'test' }}).then(function(vendor) {
            expect(vendor.email).to.equal('new@new.com');
            done();
          });
        });
    });

    it('should remove a vendor', function(done) {
      request(app)
        .delete('/a/vendors/' + vendorId)
        .expect(204)
        .end(function() {
          Vendor.findOne({ where: { company: 'test' }}).then(function(vendor) {
            expect(vendor).to.not.be.ok;
            done();
          });
        });
    });
  });
});

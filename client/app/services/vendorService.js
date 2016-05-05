import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  addVendor,
  getVendors,
  modifyVendor,
  removeVendor
};

function addVendor(vendor) {
  return fetch('/a/vendors', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ vendor })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error adding vendor: ', error);
    throw error;
  });
}

function getVendors() {
  return fetch('/a/vendors')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.vendors)
    .catch(error => {
      console.log('[Service] Error fetching vendors: ', error);
      throw error;
    });
}

function modifyVendor(id, field, value) {
  return fetch(`/a/vendors/${id}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [field]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.vendor)
  .catch(error => {
    console.log('[Service] Error modifying vendor: ', error);
    throw error;
  });
}

function removeVendor(id) {
  return fetch(`/a/vendors/${id}`, {
    method: 'delete',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error removing vendor: ', error);
    throw error;
  });
}

export default services;

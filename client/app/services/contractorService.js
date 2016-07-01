import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  addContractor,
  getContractors,
  modifyContractor,
  removeContractor,
  transferMaterial,
};

function addContractor(contractor) {
  return fetch('/a/contractors', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ contractor }),
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error adding contractor: ', error);
    throw error;
  });
}

function getContractors() {
  return fetch('/a/contractors')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.contractors)
    .catch(error => {
      console.log('[Service] Error fetching contractors: ', error);
      throw error;
    });
}

function modifyContractor(id, key, value) {
  return fetch(`/a/contractors/${id}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({ [key]: value }),
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.contractor)
  .catch(error => {
    console.log('[Service] Error modifying contractor: ', error);
    throw error;
  });
}

function removeContractor(id) {
  return fetch(`/a/contractors/${id}`, {
    method: 'delete',
    headers: h.headers,
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error removing contractor: ', error);
    throw error;
  });
}

function transferMaterial(contractorId, materialId, qty) {
  return fetch(`/a/contractors/${contractorId}/material/${materialId}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({ qty }),
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error transferring materials to contractor: ', error);
    throw error;
  });
}

export default services;

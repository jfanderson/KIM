import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  getAllMaterials,
  getMaterial,
  getTypes,
  modifyMaterial,
  modifyType
};

function getAllMaterials() {
  return fetch('/a/materials')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.materials)
    .catch(error => {
      console.log('Error fetching materials: ', error);
      throw error;
    });
}

function getMaterial(id) {
  return fetch('/a/materials/' + id)
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.material)
    .catch(error => {
      console.log('Error fetching material: ', error);
      throw error;
    });
}

function getTypes() {
  return fetch('/a/types/materials')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.types)
    .catch(error => {
      console.log('Error fetching material types: ', error);
      throw error;
    });
}

function modifyMaterial(id, field, value) {
  return fetch('/a/materials/' + id, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [field]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.material)
  .catch(error => {
    console.log('Error modifying material: ', error);
    throw error;
  });
}

function modifyType(id, field, value) {
  return fetch('/a/types/materials/' + id, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [field]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.type)
  .catch(error => {
    console.log('Error modifying material type: ', error);
    throw error;
  });
}

export default services;

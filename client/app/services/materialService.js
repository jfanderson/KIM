import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  addMaterial,
  addMaterialType,
  getAllMaterials,
  getMaterial,
  getTypes,
  modifyMaterial,
  modifyType,
  removeMaterial,
  removeMaterialType
};

function addMaterial(material) {
  return fetch('/a/materials', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ material })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error adding material: ', error);
    throw error;
  });
}

function addMaterialType(type) {
  return fetch('/a/types/materials', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ type })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error adding material type: ', error);
    throw error;
  });
}

function getAllMaterials() {
  return fetch('/a/materials')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.materials)
    .catch(error => {
      console.log('[Service] Error fetching materials: ', error);
      throw error;
    });
}

function getMaterial(id) {
  return fetch(`/a/materials/${id}`)
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.material)
    .catch(error => {
      console.log('[Service] Error fetching material: ', error);
      throw error;
    });
}

function getTypes() {
  return fetch('/a/types/materials')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.types)
    .catch(error => {
      console.log('[Service] Error fetching material types: ', error);
      throw error;
    });
}

function modifyMaterial(id, field, value) {
  return fetch(`/a/materials/${id}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [field]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.material)
  .catch(error => {
    console.log('[Service] Error modifying material: ', error);
    throw error;
  });
}

function modifyType(id, field, value) {
  return fetch(`/a/types/materials/${id}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [field]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.type)
  .catch(error => {
    console.log('[Service] Error modifying material type: ', error);
    throw error;
  });
}

function removeMaterial(id) {
  return fetch(`/a/materials/${id}`, {
    method: 'delete',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error removing material: ', error);
    throw error;
  });
}

function removeMaterialType(id) {
  return fetch(`/a/types/materials/${id}`, {
    method: 'delete',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error removing material type: ', error);
    throw error;
  });
}

export default services;

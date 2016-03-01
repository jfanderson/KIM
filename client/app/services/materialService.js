import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
};

function getAllPieces() {
  return fetch('/a/materials')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.materials)
    .catch(error => {
      console.log('Error fetching materials: ', error);
      throw error;
    });
}

function getPiece(id) {
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

function modifyPiece(id, field, value) {
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

export default services;

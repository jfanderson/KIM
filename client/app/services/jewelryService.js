import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  getAllPieces,
  getPiece,
  getTypes,
  linkMaterial,
  modifyMaterialQty,
  modifyPiece
};

function getAllPieces() {
  return fetch('/a/pieces')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.pieces)
    .catch(error => {
      console.log('Error fetching pieces: ', error);
      throw error;
    });
}

function getPiece(id) {
  return fetch('/a/pieces/' + id)
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.piece)
    .catch(error => {
      console.log('Error fetching piece: ', error);
      throw error;
    });
}

function getTypes() {
  return fetch('/a/types/pieces')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.types)
    .catch(error => {
      console.log('Error fetching piece types: ', error);
      throw error;
    });
}

function linkMaterial(pieceId, materialId) {
  return fetch('/a/pieces/' + pieceId + '/material/' + materialId, {
    method: 'post',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('Error linking material to piece: ', error);
    throw error;
  });
}

function modifyMaterialQty(pieceId, materialId, qty) {
  return fetch('/a/pieces/' + pieceId + '/material/' + materialId, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({ qty })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('Error modifying material qty: ', error);
    throw error;
  });
}

function modifyPiece(id, field, value) {
  return fetch('/a/pieces/' + id, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [field]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.piece)
  .catch(error => {
    console.log('Error modifying piece: ', error);
    throw error;
  });
}

export default services;

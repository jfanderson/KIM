import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  addPiece,
  addType,
  getAllPieces,
  getPiece,
  getTypes,
  linkMaterial,
  modifyMaterialQty,
  modifyPiece,
  modifyType,
  removePiece,
  removeType,
  unlinkMaterial
};

function addPiece(piece) {
  return fetch('/a/pieces', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ piece })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error adding piece: ', error);
    throw error;
  });
}

function addType(type) {
  return fetch('/a/types/pieces', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ type })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error adding piece type: ', error);
    throw error;
  });
}

function getAllPieces() {
  return fetch('/a/pieces')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.pieces)
    .catch(error => {
      console.log('[Service] Error fetching pieces: ', error);
      throw error;
    });
}

function getPiece(id) {
  return fetch(`/a/pieces/${id}`)
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.piece)
    .catch(error => {
      console.log('[Service] Error fetching piece: ', error);
      throw error;
    });
}

function getTypes() {
  return fetch('/a/types/pieces')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.types)
    .catch(error => {
      console.log('[Service] Error fetching piece types: ', error);
      throw error;
    });
}

function linkMaterial(pieceId, materialId, body) {
  return fetch(`/a/pieces/${pieceId}/material/${materialId}`, {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify(body)
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error linking material to piece: ', error);
    throw error;
  });
}

function modifyMaterialQty(pieceId, materialId, qty) {
  return fetch(`/a/pieces/${pieceId}/material/${materialId}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({ qty })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error modifying material qty: ', error);
    throw error;
  });
}

function modifyPiece(id, key, value) {
  return fetch(`/a/pieces/${id}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [key]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.piece)
  .catch(error => {
    console.log('[Service] Error modifying piece: ', error);
    throw error;
  });
}

function modifyType(id, key, value) {
  return fetch(`/a/types/pieces/${id}`, {
    method: 'put',
    headers: h.headers,
    body: JSON.stringify({
      [key]: value
    })
  }).then(h.checkStatus)
  .then(h.parseJSON)
  .then(data => data.type)
  .catch(error => {
    console.log('[Service] Error modifying piece type: ', error);
    throw error;
  });
}

function removePiece(id) {
  return fetch(`/a/pieces/${id}`, {
    method: 'delete',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error removing piece: ', error);
    throw error;
  });
}

function removeType(id) {
  return fetch(`/a/types/pieces/${id}`, {
    method: 'delete',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error removing piece type: ', error);
    throw error;
  });
}

function unlinkMaterial(pieceId, materialId) {
  return fetch(`/a/pieces/${pieceId}/material/${materialId}`, {
    method: 'delete',
    headers: h.headers
  }).then(h.checkStatus)
  .catch(error => {
    console.log('[Service] Error unlinking material: ', error);
    throw error;
  });
}

export default services;

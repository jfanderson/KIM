import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  getAllPieces,
  getPiece,
  modifyPiece
};

function getAllPieces() {
  return fetch('/a/pieces')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.pieces)
    .catch(error => {
      console.log('Error fetching pieces: ', error);
    });
}

function getPiece(id) {
  return fetch('/a/pieces/' + id)
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.piece)
    .catch(error => {
      console.log('Error fetching piece: ', error);
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
  });
}

export default services;

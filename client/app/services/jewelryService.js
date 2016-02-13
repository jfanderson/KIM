import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  getAllPieces,
  getPiece
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

function getPiece(pieceId) {
  return fetch('/a/pieces/' + pieceId)
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.piece)
    .catch(error => {
      console.log('Error fetching piece: ', error);
    });
}

export default services;

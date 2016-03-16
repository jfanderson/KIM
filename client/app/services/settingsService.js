import 'whatwg-fetch';
import h from '../helpers.js';

let services = {
  getSettings,
  modifyLaborCost
};

function getSettings() {
  return fetch('/a/settings')
    .then(h.checkStatus)
    .then(h.parseJSON)
    .then(data => data.settings)
    .catch(error => {
      console.log('Error fetching settings: ', error);
      throw error;
    });
}

function modifyLaborCost(cost) {
  return fetch('/a/settings/laborCost', {
    method: 'post',
    headers: h.headers,
    body: JSON.stringify({ laborCost: cost })
  }).then(h.checkStatus)
  .catch(error => {
    console.log('Error modifying labor cost: ', error);
    throw error;
  });
}

export default services;

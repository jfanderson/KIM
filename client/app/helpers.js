import 'whatwg-fetch';
import _ from 'underscore';

var helpers = {
  capitalize,
  checkStatus,
  displayPrice,
  findTypeId,
  findTypeName,
  parseJSON,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

function capitalize(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    var error = new Error(res.statusText);
    error.res = res;
    throw error;
  }
}

function displayPrice(price) {
  if (typeof price === 'string') {
    price = Number(price);
  }

  if (price % 1 === 0) {
    return '$' + price;
  } else {
    return '$' + price.toFixed(2);
  }
}

function findTypeId(types, name) {
  let type = _.findWhere(types, { name: name });
  return type && type.id;
}

function findTypeName(types, id) {
  let type = _.findWhere(types, { id: id });
  return type && type.name;
}

function parseJSON(res) {
  return res.json();
}

export default helpers;

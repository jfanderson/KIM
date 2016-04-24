import 'whatwg-fetch';
import _ from 'underscore';

let helpers = {
  capitalize,
  checkStatus,
  displayPrice,
  displayPricePerUnit,
  findPopupTopValue,
  findTypeId,
  findTypeName,
  parseJSON,
  headers: {
    Accept: 'application/json',
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
  }

  let error = new Error(res.statusText);
  error.res = res;
  throw error;
}

function displayPrice(price) {
  if (typeof price === 'string') {
    // eslint-disable-next-line no-param-reassign
    price = Number(price);
  }

  if (price % 1 === 0) {
    return `$${price}`;
  }

  return `$${price.toFixed(2)}`;
}

function displayPricePerUnit(price, unit) {
  if (unit) {
    return `${displayPrice(price)} / ${unit}`;
  }

  return `${displayPrice(price)} / `;
}

function findPopupTopValue(element) {
  return element.getBoundingClientRect().bottom + document.body.scrollTop + 8;
}

function findTypeId(types, name) {
  let type = _.findWhere(types, { name });
  return type && type.id;
}

function findTypeName(types, id) {
  let type = _.findWhere(types, { id });
  return type && type.name;
}

function parseJSON(res) {
  return res.json();
}

export default helpers;

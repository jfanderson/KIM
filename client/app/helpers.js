import 'whatwg-fetch';

var helpers = {
  checkStatus,
  displayPrice,
  parseJSON,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

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

function parseJSON(res) {
  return res.json();
}

export default helpers;

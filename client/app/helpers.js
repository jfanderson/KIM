import 'whatwg-fetch';

var helpers = {
  checkStatus,
  parseJSON
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

function parseJSON(res) {
  return res.json();
}

export default helpers;

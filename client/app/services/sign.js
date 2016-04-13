/**
These methods display a temporary sign at the top of the page to alert the user
to a brief message.
**/

let services = {
  setMessage,
  setError
};

function setMessage(message, classes) {
  let sign = document.getElementById('sign');
  sign.innerHTML = message;
  sign.className = `active ${classes}`;

  setTimeout(() => {
    sign.className = '';
  }, 4000);
}

function setError(message) {
  setMessage(message, 'error');
}

export default services;

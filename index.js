const request = require('request');
const crypto = require('crypto');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./config');

function init(customer_key, api_secret) {
  try { 
    if (!customer_key || !api_secret) throw 'Incomplete init values';
  }
  catch(err) {
    console.log(`Conichi API Error: ${ err }`);
    return;
  }

  global.customer_key = customer_key;
  global.api_secret = api_secret;
  localStorage.setItem('customer_key', customer_key);
  localStorage.setItem('api_secret', api_secret);
}

function set_uuid(session_uuid) {
  try { 
    if (!session_uuid) throw 'No UUID specified';
  }
  catch(err) {
    console.log(`Conichi API Error: ${ err }`);
    return;
  }

  global.session_uuid = session_uuid;
  localStorage.setItem('session_uuid', session_uuid);
}

function api_request(url, method, body, callback) {
  checkConfig();

  try { 
    if (!url) throw 'You have not set the URL';
    if (!method) throw 'You have not set the method';
    if (!global.customer_key || !global.api_secret) throw 'Have you forgot to call the init function first?';
  }
  catch(err) {
    console.log(`Conichi API Error: ${ err }`);
    return;
  }

  const uuid = global.session_uuid || null;

  const reuqest_body = (body) ? JSON.stringify(body) : '';

  const bodyhash_raw = crypto.createHmac('sha256', global.api_secret).update(reuqest_body).digest('base64');
  const bodyhash = bodyhash_raw.replace(/\//g, '_').replace(/\+/g, '-');

  const timestamp = Math.floor(Date.now() / 1000);
  const normalized_string = uuid + "\n" + method + "\n" + url + "\n" + bodyhash  + "\n" + timestamp;

  const hmac_raw = crypto.createHmac('sha256', global.api_secret).update(normalized_string).digest('base64');
  const hmac = hmac_raw.replace(/\//g , '_').replace(/\+/g, '-');

  request({
    url: url,
    method: method,
    json: true,
    body: body,
    headers: {
      'User-Agent': 'node.js',
      'X-Consumer-Key': global.customer_key,
      'X-Session-UUID': uuid,
      'X-HMAC': hmac,
      'X-HMAC-Version': 'HMAC-SHA256',
      'X-HMAC-Timestamp': timestamp,
      'X-Body-Hash': bodyhash
    }
  }, function (error, response, body) {
    try {
      if (error) throw 'Error making api request';
    }
    catch(err) {
      console.log(`Conichi API Error: ${ err }`, error);
      return;
    }

    callback(response);
  });
};

function upload_image(url, formData, callback) {
  checkConfig();

  try { 
    if (!url) throw 'You have not set the URL';
    if (!formData) throw 'You have not set formData';
    if (!global.customer_key || !global.api_secret) throw 'Have you forgot to call the init function first?';
    if (!global.session_uuid) throw 'Have you forgot to set the UUID first?';
  }
  catch(err) {
    console.log(`Conichi API Error: ${ err }`);
    return;
  }

  const bodyhash_raw = crypto.createHmac('sha256', global.api_secret).update('').digest('base64')
  const bodyhash = bodyhash_raw.replace(/\//g, '_').replace(/\+/g, '-')

  const timestamp = Math.floor(Date.now() / 1000);
  const normalized_string = global.session_uuid + "\nPUT\n" + url + "\n" + bodyhash  + "\n" + timestamp;

  const hmac_raw = crypto.createHmac('sha256', global.api_secret).update(normalized_string).digest('base64')
  const hmac = hmac_raw.replace(/\//g , '_').replace(/\+/g, '-')

  request({
    url: url,
    method: 'PUT',
    body: '',
    formData: formData,
    headers: {
      'User-Agent': 'node.js',
      'X-Consumer-Key': global.customer_key,
      'X-Session-Uuid': global.session_uuid,
      'X-Hmac': hmac,
      'X-Hmac-Version': 'HMAC-SHA256',
      'X-Hmac-Timestamp': timestamp,
      'X-Body-Hash': bodyhash
    }
  }, function (error, response, body) {
    try {
      if (error) throw 'Error making api request';
    }
    catch(err) {
      console.log(`Conichi API Error: ${ err }`, error);
      return;
    }

    callback(response);
  });
};

function checkConfig() {
  if (!global.customer_key) { global.customer_key = localStorage.getItem('customer_key'); }
  if (!global.api_secret) { global.api_secret = localStorage.getItem('api_secret'); }
  if (!global.session_uuid) { global.session_uuid = localStorage.getItem('session_uuid'); }
}

module.exports = {
  init : init,
  request : api_request,
  upload_image : upload_image,
  set_uuid: set_uuid
}
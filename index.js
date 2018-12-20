const request = require('request');
const crypto = require('crypto');

function api_request(url, method, body, headers, callback) {
  try { 
    if (!url) throw 'You have not set the URL';
    if (!method) throw 'You have not set the method';
    if (!headers) throw 'You have not set the headers';
  }
  catch(err) {
    console.log(`Conichi API Error: ${ err }`);
    return;
  }

  const request_body = (body) ? JSON.stringify(body) : '';

  const bodyhash_raw = crypto.createHmac('sha256', headers.api_secret).update(request_body).digest('base64');
  const bodyhash = bodyhash_raw.replace(/\//g, '_').replace(/\+/g, '-');

  const timestamp = Math.floor(Date.now() / 1000);
  const normalized_string = headers.uuid + "\n" + method + "\n" + url + "\n" + bodyhash  + "\n" + timestamp;

  const hmac_raw = crypto.createHmac('sha256', headers.api_secret).update(normalized_string).digest('base64');
  const hmac = hmac_raw.replace(/\//g , '_').replace(/\+/g, '-');

  const meta = {
    'User-Agent': 'node.js',
    'X-Consumer-Key': headers.consumer_key,
    'X-Session-UUID': headers.uuid,
    'Accept-Language': headers['accept-language'],
    'X-HMAC': hmac,
    'X-HMAC-Version': 'HMAC-SHA256',
    'X-HMAC-Timestamp': timestamp,
    'X-Body-Hash': bodyhash
  };
  
  if (headers['Authorization']) meta['Authorization'] = headers['Authorization'];

  let opts = {
    url: url,
    method: method,
    json: true,
    encoding: null,
    headers: meta
  };
    if (body) opts.body = body;

    request(opts, function (error, response, body) {
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

function upload_image(url, formData, headers, callback) {
  try { 
    if (!url) throw 'You have not set the URL';
    if (!formData) throw 'You have not set formData';
    if (!headers) throw 'You have not set the headers';
  }
  catch(err) {
    console.log(`Conichi API Error: ${ err }`);
    return;
  }

  const bodyhash_raw = crypto.createHmac('sha256', headers.api_secret).update('').digest('base64')
  const bodyhash = bodyhash_raw.replace(/\//g, '_').replace(/\+/g, '-')

  const timestamp = Math.floor(Date.now() / 1000);
  const normalized_string = headers.uuid + "\nPUT\n" + url + "\n" + bodyhash  + "\n" + timestamp;

  const hmac_raw = crypto.createHmac('sha256', headers.api_secret).update(normalized_string).digest('base64')
  const hmac = hmac_raw.replace(/\//g , '_').replace(/\+/g, '-')

  request({
    url: url,
    method: 'PUT',
    body: '',
    formData: formData,
    headers: {
      'User-Agent': 'node.js',
      'X-Consumer-Key': headers.consumer_key,
      'X-Session-Uuid': headers.uuid,
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

module.exports = {
  request : api_request,
  upload_image : upload_image
}
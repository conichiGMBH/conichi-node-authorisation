# Conichi Node Authorisation

Conichi Node Authorisation allows conichi services and 3rd party partners to make authenticated requests to the conichi API.


## Installation

Install conichi and save it in the dependencies list. For example:

`npm install conichi-node-authorisation --save`


## Example usage

```
const conichi = require('conichi-node-authorisation');

// Replace these values with the cosumer_key and api_key given to you from conichi.
conichi.init(cosumer_key, api_key);

// Set user UUID, this should be done directly after the user is logged in using the UUID
// you recieve from the login response.
conichi.set_uuid(uuid);

// Make request
conichi.request(url, method, body, function(response){
  console.log(response);
});

// To upload an image, please make sure you are submitting it as multipart/formdata.
conichi.upload_image(url, formData, function(response){
  console.log(response);
});
```

Please refer to the documentation for information about the correct url endpoints, HTTP methods and expected body content.

Please be sure to guard agaist 401 status response. If you receive a 401 error it means the session UUID has expired and the user must be prompted to  start a new session before any more requests can be sent to the API.


## API documentation

The documentation for our API can be found here:
<https://github.com/conichiGMBH/api-documentation>


## Report issues

If you have any issues with this module, please contact <marc.horne@conichi.com>.
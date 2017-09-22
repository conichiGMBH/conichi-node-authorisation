# Conichi Node Authorisation

Conichi Node Authorisation allows conichi services and 3rd party partners to make authenticated requests to the conichi API.


## Installation

Install conichi and save it in the dependencies list. For example:
`npm install conichi --save`


## Example usage

```
const conichi = require('conichi-node-authorisation');

// Replace these values with the cosumer_key, api_key, session_uuid given to you from conichi
conichi.init(cosumer_key, api_key, session_uuid);

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


## API documentation

The documentation for our API can be found here:
<https://github.com/conichiGMBH/api-documentation>


## Report issues

If you have any issues with this module, please contact <marc.horne@conichi.com>.
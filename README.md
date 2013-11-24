# node-automatic

API wrapper for the Automatic app

## Basic Usage

    var automatic = require('automatic')({
      username: 'API_USERNAME',
      password: 'API_PASSWORD'
    });

    automatic.cars(function(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log(body); // Print the JSON response from the Automatic API
      }
    });

## Configuration

Right now the Automatic API uses HTTP Basic Auth for access to make calls. Follow the instructions on the PHP port of [finding your Automatic API credentials](https://github.com/adamwulf/automatic-php-api/wiki).

Once you get your username and password you can pass those into to the `require` call.

    var automatic = require('automatic')({
      username: 'API_USERNAME',
      password: 'API_PASSWORD'
    });

## Methods

Since this module depends on [request](https://github.com/mikeal/request), the callback is the same callback you would get from using requst.

    function(error, response, body){

    }

### preferences(callback)

This method will return preference and account information, including name, timezone, audio preferences, vin numbers, etc.

### linkInfo(callback)

This method will return information about the Automatic links on your account.

### cars(callback)

This will return detailed information about the cars in your account.

### trips(options, callback)

Returns all trips that are between the start and end timestamps. The `options` object must contain:

* `startTime` - time in milliseconds
* `endTime` - time in milliseconds

### scores(options, callback)

Returns all trips that are between the start and end timestamps. The `options` object must contain:

* `startTime` - time in milliseconds
* `endTime` - time in milliseconds
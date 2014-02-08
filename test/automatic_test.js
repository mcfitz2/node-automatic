'use strict';

var automatic = require('../lib/automatic.js').createClient('CLIENT_ID', 'CLIENT_SECRET');
var authUrl;

exports.automatic = {
  setUp: function(done){
    authUrl = automatic.authorizeUrl(['SCOPE_1','SCOPE_2','SCOPE_3'], 'STATE');

    done();
  },
  'sets up the client': function(test){
    test.equal(automatic.client_id, 'CLIENT_ID', 'Sets the Client ID');
    test.equal(automatic.client_secret, 'CLIENT_SECRET', 'Sets the Client Secret');

    test.done();
  },
  'configures the authorization url to redirect to': function(test){
    var expectedAuthUrl = 'https://www.automatic.com/oauth/authorize?client_id=CLIENT_ID&scope=SCOPE_1%20SCOPE_2%20SCOPE_3&state=STATE&response_type=code';

    test.equal(authUrl, expectedAuthUrl, 'Auth URL correct');

    test.done();
  },
  'validate the response from the authorization': function(test){
    test.doesNotThrow(function() {
      automatic.validateAuthorization('CODE', 'STATE');
      test.equal(automatic.code, 'CODE', 'Sets the Code');
    }, Error, 'Invalid state');
    
    test.throws(function() {
      automatic.validateAuthorization('CODE', 'WRONG_STATE');
    }, Error, 'Invalid state');

    test.done();
  },
  'verifies the token': function(test){
    automatic.token = {};
    automatic.token.expires_in = 10; // Valid 10 seconds

    automatic.lastTokenRequestedAt = new Date().getTime() - 5 * 1000; // Requested 5 seconds ago
    test.ok(automatic.isTokenValid(), 'Token is valid');

    automatic.lastTokenRequestedAt = new Date().getTime() - 10 * 1000; // Requested 10 seconds ago
    test.ok(!automatic.isTokenValid(), 'Token has expired');

    test.done();
  }
};

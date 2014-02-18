# Automatic API Node.js module

Used to access the [Automatic API](https://www.automatic.com/developer/).

## Setup, Usage, and Tests

There is a sample Express app in the root of this repo. Just fire it up and check it out.

    node index.js

The nodeunit tests can be run with Grunt.

    grunt test

## Methods

Any `callback` will be the same callback you would get from using [request](https://github.com/mikeal/request).

### authorizeUrl(scopes, state)

This method will construct the correct URL you should redirect your users to to grant your app authorization.

* `scopes` - array of [scopes](https://www.automatic.com/developer/documentation/#scopes) to grant access to
* `state` - an unguessable random string used to protect against cross-site request forgery attacks

### validateAuthorization(code, state)

This method will set the code from a valid authorization. Throws an `Error` if the states do not match.

* `code` - the `code` from the GET parameter on redirection back from Automatic
* `state` - the same `state` used in `authorizeUrl()`

### requestToken(callback)

This method request the OAuth token from Automatic needed for all REST calls.

### refreshToken(callback)

This method refreshes the OAuth token with the current token.

### isTokenValid()

Returns whether the current token has expired or not.

### trips(options, callback)

Returns a single trip specified by `id` OR multiple trips based on `page` and `per_page` values. The `options` object must contain:

* `id` - specific trip id

```javascript
// returns trip with ID = 5
automatic.trips({ id: 5 }, function(err, res, body){
  var trips = body;
});
```

OR

* `page` - page number (defaults to 1)
* `per_page` - number of trip to return per page (defaults to 100)

```javascript
// return page 5 with 10 trips
automatic.trips({ page: 5, per_page: 10 }, function(err, res, body){
  var trips = body;
});
```

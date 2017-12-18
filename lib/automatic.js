var needle = require('needle');
var querystring = require("querystring");
var async = require("async");
var url = require('url');
var config = {
    api: {
        host: 'https://api.automatic.com',
    },
    oauth: {
        authorizeUrl: 'https://accounts.automatic.com/oauth/authorize',
        tokenUrl: 'https://accounts.automatic.com/oauth/access_token'
    }
};

function AutomaticClient(options) {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.token = {
        access_token: options.access_token
    };
    return this;
}
exports.AutomaticClient = AutomaticClient;
AutomaticClient.prototype.authorizeUrl = function(scopes, state) {
    this.state = state;
    return config.oauth.authorizeUrl + '?' + querystring.stringify({
        client_id: this.client_id,
        scope: scopes.join(' '),
        state: state,
        response_type: "code"
    });
};
AutomaticClient.prototype.validateAuthorization = function(code, state) {
    if (this.state === state) {
        this.code = code;
    } else {
        throw new Error('Unexpected state string.');
    }
};
AutomaticClient.prototype.requestToken = function() {
    var self = this;
    this.lastTokenRequestedAt = new Date().getTime();
    return new Promise(function(resolve, reject) {
        needle.post(config.oauth.tokenUrl, {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code: this.code,
            grant_type: 'authorization_code'
        }, function(error, response, body) {
            self.token = body;
            if (error) {
                reject(error);
            } else {
                resolve({
                    response: response,
                    body: body
                });
            }
        });
    });
};
AutomaticClient.prototype.refreshToken = function() {
    var self = this;
    this.lastTokenRequestedAt = new Date().getTime();
    return new Promise(function(resolve, reject) {
        needle.post(config.oauth.tokenUrl, {
            refresh_token: this.token.refresh_token,
            grant_type: 'refresh_token'
        }, function(error, response, body) {
            self.token = body;
            if (error) {
                reject(error);
            } else {
                resolve({
                    response: response,
                    body: body
                });
            }
        });
    });
};
AutomaticClient.prototype.isTokenValid = function() {
    var expireInMs = this.token.expires_in * 1000;
    return (this.lastTokenRequestedAt + expireInMs > new Date().getTime());
};
AutomaticClient.prototype.call = function(resource, options) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var paginate = false;
        options = options || {};
	if (options.paginate) {
            paginate = true;
            delete options.paginate;
        }
        var endpoint = config.api.host + "/" + resource + "/?" + querystring.stringify(options);
        var headers = {
            Authorization: 'Bearer ' + self.token.access_token
        };
        console.log(endpoint, headers, options);
        if (paginate) {
            var results = [];
            async.doWhilst(function(callback) {
                needle.get(endpoint, {
                    headers: headers
                }, function(error, request, body) {
                    var page = url.parse(endpoint, true).query.page || null;
                    console.log(body);
		    endpoint = body._metadata.next;
                    //console.log(body);
                    results.push({
                        page: page,
                        request: request,
                        body: body
                    });
                    callback(error);
                });
            }, function() {
                return endpoint != null;
            }, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        } else {
            needle.get(endpoint, {
                headers: headers
            }, function(error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        response: response,
                        body: body,
                        page: 1
                    });
                }
            });
        }
    });
};
AutomaticClient.prototype.trips = function(options) {
    return this.call("trip", options);
};
AutomaticClient.prototype.vehicles = function(options) {
    return this.call("vehicle", options);
};
AutomaticClient.prototype.users = function(options) {
    options.paginate = false;
    return this.call("user", options);
};
AutomaticClient.prototype.devices = function(options) {
    return this.call("device", options);
};
AutomaticClient.prototype.me = function() {
    var headers = {
        Authorization: 'Bearer ' + this.token.access_token
    };

    function getProfile(resolve, reject) {
        needle.get(config.api.host + "/user/me/profile/", {
            headers: headers
        }, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    response: response,
                    body: body
                });
            }
        });
    }

    function getDevices(resolve, reject) {
        needle.get(config.api.host + "/user/me/device/", {
            headers: headers
        }, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    response: response,
                    body: body
                });
            }
        });
    }

    function getMetadata(resolve, reject) {
        needle.get(config.api.host + "/user/me/metadata/", {
            headers: headers
        }, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    response: response,
                    body: body
                });
            }
        });
    }
    return new Promise(function(resolve, reject) {
        var endpoint = config.api.host + "/user/me/";
        needle.get(endpoint, {
            headers: headers
        }, function(error, response, body) {
            Promise.all([new Promise(getProfile), new Promise(getMetadata), new Promise(getDevices)]).then(function(results) {
                resolve(results);
            }).catch(function(error) {
                reject(error);
            });
        });
    });
};
exports.createClient = function(options) {
    var client = new AutomaticClient(options);
    return client;
};

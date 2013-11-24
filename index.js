var _ = require('underscore');
    request = require('request');

var automatic = function(config){

  var defaultConfig = {
    host: 'https://secure.milesense.com',
    apiVersion: '/v3'
  };

  var config = _.extend(config, defaultConfig);

  return {
    preferences: function(callback){
      var endpoint = config.host + config.apiVersion + '/user/preferences';
      
      request({
        method: 'GET',
        uri: endpoint,
        auth: {
            user: config.username,
            pass: config.password
          }
        }, 
        callback);
    },

    linkInfo: function(callback){
      var endpoint = config.host + config.apiVersion + '/link/info';
      
      request({
        method: 'GET',
        uri: endpoint,
        auth: {
            user: config.username,
            pass: config.password
          }
        }, 
        callback);
    },

    cars: function(callback){
      var endpoint = config.host + config.apiVersion + '/car';
      
      request({
        method: 'GET',
        uri: endpoint,
        auth: {
            user: config.username,
            pass: config.password
          }
        }, 
        callback);
    },

    trips: function(options, callback){
      var endpoint = config.host + config.apiVersion + '/user/trips';

      var data = JSON.stringify({
        start_time: options.startTime,
        end_time: options.endTime
      });
      
      request({
        method: 'POST',
        uri: endpoint,
        auth: {
            user: config.username,
            pass: config.password
          },
        form: {
          data: data
          }
        }, 
        callback);
    },

    scores: function(options, callback){
      var endpoint = config.host + config.apiVersion + '/user/scores';
      
      var data = JSON.stringify({
        start_time: options.startTime,
        end_time: options.endTime
      });

      request({
        method: 'POST',
        uri: endpoint,
        auth: {
            user: config.username,
            pass: config.password
          },
        form: {
          data: data
          }
        },
        callback);
    }
  };

};

module.exports = automatic;
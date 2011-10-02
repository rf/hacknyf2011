var httpget = require('http').get;

var exports = {};

exports.hyperpublic = function () {
   "use strict";
   var pub = {}, priv = {};

   priv.rest = function (type, params, callback) {
      params.client_id = "8UufhI6bCKQXKMBn7AUWO67Yq6C8RkfD0BGouTke";
      params.client_secret = "zdoROY5XRN0clIWsEJyKzHedSK4irYee8jpnOXaP";
      var get, k;
      for (k in params) if (params.hasOwnProperty(k)) {
         get += params[k] + "&";
      }
      var options = {
         host  : 'api.hyperpublic.com',
         path  : '/api/v1/' + type + "?" + get,
         port  : 80
      };
      httpget (options, function (res) {
         callback(res);
      });
   };

   pub.findRestaurants = function (loc, value) {
      priv.rest ('places', {location : 'chicago', 'category' : 'food'}, 
         function(res) {
            console.log (res);
         }
      );
   };

   return pub;
};

test = exports.hyperpublic ();
test.findRestaurants (0, 0);



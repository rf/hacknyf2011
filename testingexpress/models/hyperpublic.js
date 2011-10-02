var request = require('request');
var mongo = require('mongolian');
var _ = require('underscore');

exports.hyperpublic = function (db) {
   "use strict";
   var pub = {}, priv = {};

   priv.rest = function (type, params, callback) {
      params.client_id = "8UufhI6bCKQXKMBn7AUWO67Yq6C8RkfD0BGouTke";
      params.client_secret = "zdoROY5XRN0clIWsEJyKzHedSK4irYee8jpnOXaP";
      var get='', k;
      for (k in params) if (params.hasOwnProperty(k)) {
         get += k + "=" + params[k] + "&";
      }/*
      var options = {
         host  : 'api.hyperpublic.com',
         path  : '/api/v1/' + type + "?" + get,
         port  : 80
      };
      httpget (options, function (res) {
         callback(res);
      });*/
      console.log (get);
      request('https://api.hyperpublic.com/api/v1/' + type + '?' + get, function (error, body, response) {
         if (error) throw error;
         try {
            response = JSON.parse(response);
         } catch (e) {
            console.log (response);
            throw e;
         }
         callback (response);
      });
   };

   priv.cacheLocations = function (loc, value, category, callback) {
      var i, j, key, leni, lenj, locations_with_value = [], locations = [], test,
          k, done_loops = 0;
      for (k = 1; k <= 4; k++) {
         priv.rest ('places', {location : loc, 'category' : category, 'page' : k, 'page_size' : 50},
            function(res) {
               leni = res.length;
               for (i = 0; i < leni; i++) {
                  test = 0;
                  lenj = res[i].properties.length;
                  for (j = 0; j < lenj; j++) {
    //                 console.log (res[i].properties[j]);
                     if (res[i].properties[j].key === "price") {
    //                    locations_with_value.push(res[i]);
                        test = 1;
                     }
                  }
                  lenj = res[i].images.length;
                  for (j = 0; j < lenj; j++) {
                     if (res[i].images[j].src_large !== "http://hyperpublic.com/images/icons/public_place/gov/square.png") {
                        //test++;
                     }
                  }
                  if (test === 1) {
                     locations_with_value.push (res[i]);
                  }
               }
               locations_with_value.forEach(function (place) {
                  var pr;
                  place.properties.forEach(function (prop) {
                     if (prop.key === "price") {
                        pr = prop.value.split("$").length - 1;
                     }
                  });
                  locations.push({
                     "name"      : place.display_name,
                     "category"  : category,
                     "location"  : loc,
                     "price"     : pr,
                     "image"     : place.images[0].src_large,
                     "address"   : place.locations[0].name
                  });
               });
               var loc_len = locations.length;
               var loc_done = 0;
               locations.forEach(function (doc) {
                  priv.db.save(doc, function () {
                     loc_done++;
                     if (loc_done === loc_len-1) {
                        done_loops++;
                        if (done_loops === 4) callback();
                     }
                  });
               });
               //console.log (JSON.stringify (locations, null, 3));
            }
         );
      }
   };

   priv.runCachedQuery = function (theloc, thevalue, thecategory, callback) {
      priv.db.find({location: theloc}).toArray (function (err, arr) {
         if (err) throw err;
         console.log (arr);
         callback (arr);
      });
   };

   pub.findLocations = function (loc, value, category, callback) {
      priv.db.findOne({'loc' : loc, 'category': category}, function (err, data) {
         if (err) {
            throw err;
         }
         if (data !== undefined) {
            // run the query out of cache
            priv.runCachedQuery (loc, value, category, callback);
         } else {
            console.log ('no cache!');
            priv.cacheLocations (loc, value, category, function () {
               priv.db.save ({'loc' : loc, 'category' : category});
               console.log ('ran cachelocations');
               priv.runCachedQuery (loc, value, category, callback);
            });
         }
      });
   };

   priv.db = db;

   return pub;
};

//var somedb = new mongo.Db('cheapchap', new mongo.Server ("127.0.0.1", 27017, {}));
//somedb.open (function (error, db) {
//   if (error) {
//      throw (error);
//   }
/*
var server = new mongo();
var db = server.db('cheapchap');
var loc = db.collection('locations');

test = exports.hyperpublic(loc);
test.findLocations ('san%20fransisco', 3, "hotels", function (arr) { console.log(arr); });
//});*/


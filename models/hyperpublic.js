var request = require('request');
var mongo = require('mongolian');
var _ = require('underscore');

var yelp = require("yelp").createClient({
            //consumer_key: "U5XZjjllVhC4gt1rtEabrw",
//            consumer_key: "fIAc81be_pt__L3TK47mNw",
//            consumer_secret: "-XTXcYvgPh8anInpAYrSImmOTHs",
            //consumer_secret: "0cw0RHLsBi4nKfNfGsWS6vC9AfA",
//            consumer_secret: "kU4yrKwddUBHnNa0Q_1BcMB1w04",
//            token: "jLzcmltuso2zCO51O6ID1S8UcePSiX_S",
           //token: "AiysCogTNSwz1QK5aVdS1i15GB7toLmc",
//          token: "Y83jY74FM3JIA5xsol7HEn5vurZsGGqi",
//            token_secret: "LlDzta29cjw-fh-4fH0eMNe2jbI"
            //token_secret: "TI_ApsukBkhlV9AulFuYdlh9RaI"
//            token_secret: "wYWG8RHd03YZa1MvXsc0juSVxxk"
   consumer_key: "swwatQcoJz1db2Ec2hFXZQ",
   consumer_secret: "-XTXcYvgPh8anInpAYrSImmOTHs",
   token: "NNSNRCfKsdfHq4CtwSMG_MAVAEVFYLFm",
   token_secret: "wZT3ifshSRJHgCtcxs0J7dMYwH8"    
});


exports.hyperpublic = function (db) {
   "use strict";
   var pub = {}, priv = {};

var doyelp = function (req, res){
      for( var i =0; i < 10; i++){
              yelp.search({term: req.cat, location: req.loc, offset: i*20}, function(error, data) {
               if (error) {
                  console.log (error);
               }
                 for(var key in data['businesses']){
                    var item = data['businesses'][key];

                  //if (!item.hasOwnProperty('image_url')) continue;
                  //console.log(item);        
                    var toInsert = {};
                    toInsert['category'] = req.cat;
                    toInsert['location'] = req.loc;
                    toInsert['_id'] = item['name'] + req.loc;
                    toInsert['phone'] = item['phone'];
                    toInsert['price'] = 1;
                    toInsert['image'] = item['image_url'];
                    toInsert['name'] = item['name'];
                    toInsert['address'] = item['location']['display_address'][0] + ", " +  item['location']['display_address'][1];
                    toInsert.url = item['url'];
                    priv.db.save(toInsert);
                 }
         });
      }
 //  if (res)
   //      res.send("Ok");
};



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
      //console.log (get);
      request('https://api.hyperpublic.com/api/v1/' + type + '?' + get, function (error, body, response) {
         if (error) throw error;
         try {
            response = JSON.parse(response);
         } catch (e) {
            //console.log (response);
            return;
         }
         callback (response);
      });
   };

   priv.cacheLocations = function (loc, value, category, callback) {
      var i, j, key, leni, lenj, locations_with_value = [], locations = [], test,
          k, done_loops = 0, test2;
               var called_callback=false;
      for (k = 1; k <= 10; k++) {
         priv.rest ('places', {location : loc, 'category' : category, 'page' : k, 'page_size' : 50},
            function(res) {
               //console.log ('actually got a response');
               leni = res.length;
               for (i = 0; i < leni; i++) {
                  test2 = 0;
                  test = 0;
                  lenj = res[i].properties.length;
                  for (j = 0; j < lenj; j++) {
    //                 console.log (res[i].properties[j]);
                     if (res[i].properties[j].key === "price") {
    //                    locations_with_value.push(res[i]);
                        test++; //test2=1;
                     }
                  }
                  lenj = res[i].images.length;
                  for (j = 0; j < lenj; j++) {
                     if ((res[i].images[j].src_large.indexOf("public_place") === -1 ) &&
                         (res[i].images[j].src_large.indexOf("knifefork") === -1)) {
                        test++;
                        res[i].image = res[i].images[j].src_large;
                        test2 = 1;
                     }
                  }
                  /*if (test === 2) {
                     locations_with_value.push (res[i]);
                  }
                  if ((test2 === 1) && ((category === 'hotels') || (category === 'entertainment') || (category === 'motel'))) {
                     locations_with_value.push (res[i]);
                  }*/
                  locations_with_value.push(res[i]);
               }
               var loc_len = 0;
               locations_with_value.forEach(function (place) {
                  var pr;
                  place.properties.forEach(function (prop) {
                     if (prop.key === "price") {
                        pr = prop.value.split("$").length - 1;
                     }
                  });
                  locations.push({
                     "_id"       : place.display_name + loc,
                     "name"      : place.display_name,
                     "category"  : category,
                     "location"  : loc,
                     "price"     : pr,
                     "image"     : place.image,
                     "address"   : place.locations[0].name,
                     "phone"     : place.phone_number,
                     "url"       : place.perma_link
                  });
                  loc_len++;
               });
               done_loops+=loc_len;
               //console.log('loc_len is ' + loc_len);
               //console.log('done loops is: ' + done_loops);
               locations.forEach(function (doc) {
                  priv.db.save(doc);
               });
               if (done_loops >= 3 && !called_callback) {
                  called_callback = true;
                  callback();
               }
               //console.log (JSON.stringify (locations, null, 3));
            }
         );
      }
   };

   priv.runCachedQuery = function (theloc, thevalue, thecategory, callback) {
      var search = {};
      search.location = theloc;
      search.category = thecategory
      if (thevalue === "any") {
      } else {
         search.price = {$lt: Number(thevalue)};
      }
      priv.db.find(search).toArray (function (err, arr) {
         if (err) throw err;
         var rnd = Math.floor(Math.random()*(arr.length - 1));
//         var rnd2 = Math.floor(Math.random()*(arr.length - 1));
//         var rnd3 = Math.floor(Math.random()*(arr.length - 1));
         arr = arr.slice(rnd, rnd+3);
 //        console.log (arr);
 //        console.log(arr[0].name);
 //        console.log(arr[1].name);
 //        console.log(arr[2].name);
        
 //        callback ([arr[rnd], arr[rnd2], arr[rnd3]]);
         callback(arr);
      });
   };

   pub.findLocations = function (loc, value, category, callback) {
      loc = loc.toLowerCase();
      category = category.toLowerCase();
      priv.db.findOne({'loc' : loc, 'category': category}, function (err, data) {
         if (err) {
            throw err;
         }
         if (data !== undefined) {
            // run the query out of cache
            priv.runCachedQuery (loc, value, category, callback);
         } else {
            doyelp ({loc: loc, cat: category}, {});
            //console.log ('no cache!');
            priv.db.save ({'loc' : loc, 'category' : category});
            priv.cacheLocations (loc, value, category, function () {
               //console.log ('ran cachelocations');
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


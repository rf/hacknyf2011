var mdb = require('mongolian');
var request = require('request');
var _ = require('underscore');
var sys = require('sys');

exports.etsy = function (collection)
{
   "use strict";
   var pub = {}, priv = {};

   priv.collection = collection;
   var api_key = "qe2a1git55h74s5etlpxlot9";
   var bitly_key = "R_e74f387cfc695e9ad57183993fc7005a";

   priv.bitly_url = function (item, callback)
   {
      var long_url = encodeURIComponent(item['url']);
      var response;
      var url = "http://api.bitley.com";
      var path = "/v3/shorten?login=cheapdate&apiKey=" + bitly_key + "&longUrl=" + long_url+"&format=json";
   };

   priv.genCache = function (max_price, callback) {
      var url = "http://openapi.etsy.com";
      var terms = encodeURIComponent("jewelry,flowers");
      var path = "/v2/public/listings/active.json?keywords="+ terms +"&max_price="+max_price+"&includes=Images:1&api_key="+api_key;

      request(url+path, function(err, res, body) {
         //console.log("gen etsy db");
         if (err)
            throw err;         

         if (res.statusCode == 200) {
            res = body;
            var items = JSON.parse(body);
            
            for (var i in items['results']) {
               if (items['results'][i]['currency_code'] != "USD" || items['results'][i]['price'] >= max_price || items['results'][i]['title'].match(/mold/i))
               {
                  continue;
               }                  
               
               var stor = {};
               var item = items['results'][i];
                  
               stor['name'] = item['title'];
               stor['price'] = item['price'];
               stor['image'] = item['Images'][0]['url_570xN'];
               stor['url'] = item['url'];
               priv.collection.save(stor);
            }
            
         } else {
            //console.log("genCache: got bad response, err:"+response.statusCode);
         }

         callback();
      });
   }

   priv.runQuery = function (max_price, return_amount, callback) {
      priv.collection.find({}).toArray(function(err, arr) {
   
         if (err)
            throw err;
         
         var len = arr.length;
         var rand = Math.floor(Math.random()*(len-(return_amount-1)));
         var slice = arr.slice(rand, rand+return_amount);
         
         callback(slice); 
      });
   };

   pub.find = function(max_price, return_amount, callback)
   {
      //console.log("etsy called");
      return_amount = Number(return_amount);
      max_price = Number(max_price);
      
      priv.collection.findOne({ price: { $lte : Number(max_price) }}, function (err, data)
      {
         if (err)
            throw err;
         
         priv.runQuery(max_price, return_amount, callback);
      });
   }

   priv.genCache('30.00', function(){});
   setInterval(function() { priv.genCache('30.00', function(){}) }, 60 * 60 * 1000);

   return pub;
}

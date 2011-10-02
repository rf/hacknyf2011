var mdb = require('mongodb');
var request = require('request');

exports.etsy = function () {
        "use strict";
        var pub = {}, priv = {};
        var api_key = "qe2a1git55h74s5etlpxlot9";
        var bitly_key = "R_e74f387cfc695e9ad57183993fc7005a";
      
        priv.bitly_url = function(item, callback){
            var long_url = encodeURIComponent(item['url']);
            var response; 
            var url="http://api.bitly.com";
            var path = "/v3/shorten?login=cheapdate&apiKey=" + bitly_key + "&longUrl=" + long_url + " &format=json";
            var response; 
            request(url+path, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        response = JSON.parse(body);
                        //console.log(response);
                        callback(item,response);
                    }
            })
      };


        pub.findGifts= function (callback) {
                        
               var  url = "http://openapi.etsy.com";
               var terms="ring";
               var path = "/v2/public/listings/active.json?keywords=" +terms+ "&limit=10&includes=Images:1&api_key="+api_key;
               var response; 
                request(url+path, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                     response = body;
                     var items = JSON.parse(body);
                     var num_responses = 0;
                     var toReturn = new Array();

                     var length = items['results'].length;
   
                     for( var key in items['results']){
                        if (items['results'][key]['title'] == "USD"){
                           continue;
                        }
                        priv.bitly_url(items['results'][key], function (item_old,response){
      
                                var item = {};
                                item['name'] = item_old['title'];
                                item['description'] = item_old['description'];
                                item['price'] = item_old['price'];
                                item['image'] = item_old['Images'][0]['url_570xN'];
                                console.log("we are here");
                                 item['url'] = response['data']['url'];
                                //console.log(items['results'][key]);
                                toReturn.push(item);
                                num_responses++;
                                if(num_responses == length){
                                     console.log(toReturn);
                                    callback(0,toReturn);
                              }
                        })
                        
                     }

                  }else{
                     console.log("got error:" + error + " and reponse:" + response);
                     callback(1,0);
                  }
                })

                  console.log("made the request to " + url +  path);
        };
        return pub;
};

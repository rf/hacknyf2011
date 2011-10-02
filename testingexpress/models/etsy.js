var mdb = require('mongodb');
var request = require('request');

exports.etsy = function (collection) {
        "use strict";
        var pub = {}, priv = {};
        priv.collection = collection;
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


        pub.findGifts= function (my_price,num_to_return,callback) {
               num_to_return = Number(num_to_return); 
               my_price = Number(my_price);
               console.log("everything should have a price less than " + my_price);
               priv.collection.find( { price : { $lte: my_price} } ).toArray( function (err, arr){
                  if( !err){
                     var len = arr.length;
                    var randomnumber=Math.floor(Math.random()* (len - (num_to_return -1)) );
                     var slice = arr.slice(randomnumber, (randomnumber + num_to_return));
                     //console.log(slice[0]);
                     callback(0,slice);
                  }

               });
                        /*
               var  url = "http://openapi.etsy.com";
               var terms= encodeURIComponent("jewelry,flowers");
               var path = "/v2/public/listings/active.json?keywords=" +terms+ "&limit=100&includes=Images:1&api_key="+api_key;
               var response; 
                request(url+path, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                     response = body;
                     var items = JSON.parse(body);
                     var toReturn = new Array();

   
                     for( var key in items['results']){
                        if (items['results'][key]['currency_code'] == "USD"){
                                var item = {};
                                var item_old = items['results'][key];
                                item['name'] = item_old['title'];
                              
                  
                                item['description'] = item_old['description'];
                                item['price'] = item_old['price'];
                                item['image'] = item_old['Images'][0]['url_570xN'];
                                item['url'] = item_old['url'];
                                //console.log(items['results'][key]);
               
                                if ((item['price'] <= price) && ( ! item['name'].match(/mold/i ))){
                                   toReturn.push(item);
                                }
                     }else{
                        console.log(items['results'][key]['currency_code']);
                     }
                           
                     
                     }

                    var real_size = toReturn.length;
                    var randomnumber=Math.floor(Math.random()*real_size) 
                    priv.bitly_url(toReturn[randomnumber],function( item, response){
                     toReturn[randomnumber]['url'] = response['data']['url']; 
                     callback(0,toReturn[randomnumber]);
                  }) 


                  }else{
                     console.log("got error:" + error + " and reponse:" + response);
                     callback(1,0);
                  }
                })
      */

        }; 
        return pub;
};

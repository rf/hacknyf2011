/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    posts = require('./models/posts').posts('localhost', 27017),
    mongo = require('mongolian'),
    mongo_server = new mongo(),
    db = mongo_server.db('cheapchap'),
    qs = require('querystring'),
    etsy = require('./models/etsy').etsy(db.collection('etsy')),
    hp = require('./models/hyperpublic').hyperpublic(db.collection('locations'));

/**
 * Server configuration.
 */
app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(express.cookieParser());
   app.use(express.session({ secret: 'ga5uP7AKuprethew' }));
   app.use(require('stylus').middleware({ src: __dirname + '/public' }));
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(express.errorHandler()); 
});

/**
 * Routes
 */
app.get('/', function(req, res){
   res.render('index', { title: "cheapchap" });
});


app.get("/hp/:loc/:cat/:price", function (req, res) {
   console.log(req.params);
   hp.findLocations (
      req.params.loc, 
      req.params.price, 
      req.params.cat,
      function (arr) {
         res.json(arr);
      }
   );
});

app.post("/date_engine",  function (request, response) {
  var zip_code = request.body.location; 
  if ( typeof(zip_code) == "undefined"){
      response.send("<message><content>You need to set a location before you can get date ideas <br/><a query=\"scratch.russfrank.us\" /> Back to home</content></message>\n");
  }
  zip_code = zip_code.replace(" ","+");
  console.log("zip code is..." + zip_code);
  var price = "2";
  hp.findLocations( zip_code, price, "food", function (food_arr){
     var food_place = food_arr[0];
      hp.findLocations( zip_code, price, "hotels", function (hotel_arr){
         var hotel_place = hotel_arr[0]; 

         hp.findLocations( zip_code, price, "entertainment", function (frolic_arr){
            var frolic_place = frolic_arr[0]; 
            etsy.findGifts( "25", "1", function (error, data){
               console.log(hotel_place);
               console.log(food_place);
               var gift = data[0];
               gift['name'] = gift['name'].replace("/<.*?>/","");
               gift['name'] = gift['name'].replace("/&/","");
               gift['description'] = gift['description'].replace("/&/","");
               var output = "<message><content>\n";
                  output += "Your Date Intinerary:<br/>\n";


                  output += "<anchor><message><content>" + gift['name'] + "-- $" + gift['price'] + "<br/>" + gift['description']+ " </content></message></anchor>Gift: " + gift['name'] + " -- $" + gift['price'] + "<br/>\n";


                  output += "<anchor><message><content>" + frolic_place['name'] + "<br/>" + frolic_place['address']+ " </content></message></anchor>Activity: " + frolic_place['name'] +  "<br/>\n";

                  output += "<anchor><message><content>" + food_place['name'] + "<br/>" + food_place['address'] + " </content></message></anchor>Food: " + food_place['name'] +"<br/>\n";
                  
                  output += "<anchor><message><content>" + hotel_place['name'] +  "<br/>" + food_place['address']+ " </content></message></anchor>Accommodations: " + food_place['name']+ "<br/>\n";

               output += "</content></message>\n";    
               response.send(output);
            });
         });

    });


   });
      
});

app.get("/etsy/:max_price/:num_to_return", function (req,res){
   etsy.findGifts(
      req.params.max_price, req.params.num_to_return,
      function(error,data) {
         if (error){   
            throw error;
         } else {
            res.json(data);
         }
      }
   );
});

app.listen(3011);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

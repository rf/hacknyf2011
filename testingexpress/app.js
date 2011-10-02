/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    posts = require('./models/posts').posts('localhost', 27017),
    mongo = require('mongolian'),
    mongo_server = new mongo(),
    db = mongo_server.db('cheapchap'),
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

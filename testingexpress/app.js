/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var posts = require('./models/posts').posts('localhost', 27017);
var etsy = require('./models/etsy').etsy();

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


app.get("/etsy/:max_price", function (req,res){
      etsy.findGifts(req.params.max_price,function(error,data){
         if (error){   

         }else{
            res.json(data);

         }
      })

   })

app.listen(3011);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

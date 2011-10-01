
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var posts = require('./models/posts').posts('localhost', 27017);

// Configuration

app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(express.cookieParser());
   app.use(express.session({ secret: 'your secret here' }));
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

// Routes

app.get('/', function(req, res){
   posts.findAll(function (error, data) {
      if (error) {
         throw error;
      }
      res.render('index', {
         title    : 'blog',
         articles : data
      });
   });
});

app.get('/blog/new', function (req, res) {
   res.render('new.jade', { title : "New Post" });
});

app.post('/blog/new', function (req, res) {
   posts.save ({
      title    : req.param('title'),
      body     : req.param('body')
   }, function (error, data) {
      if (error) {
         throw error;
      }
      res.redirect('/');
   });
});

app.get('/blog/:id', function (req, res) {
   posts.findById (req.params.id, function (error, post) {
      if (error) {
         throw error;
      } else {
         res.render('post', { title: 'myblog', article: post });
      }
   });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

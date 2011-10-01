var mdb = require('mongodb');

exports.posts = function (host, port) {
   "use strict";
   var pub = {}, priv = {};

   pub.getCollection = function (callback) {
      priv.db.collection ('articles', function (error, collection) {
         if (error) {
            callback (error);
         } else {
            callback (null, collection);
         }
      });
   };

   pub.findAll = function (callback) {
      pub.getCollection(function (error, collection) {
         if (error) {
            callback (error);
         } else {
            collection.find().toArray(function (error, result) {
               if (error) {
                  callback(error);
               } else {
                  callback(null, result);
               }
            });
         }
      });
   };

   pub.findById = function (id, callback) {
      pub.getCollection(function (error, collection) {
         if (error) {
            callback (error);
         } else {
            id = collection.db.bson_serializer.ObjectID.createFromHexString(id);
            collection.findOne ({_id : id}, function (error, result) {
               if (error) {
                  callback (error)
               } else {
                  callback (null, result);
               }
            });
         }
      });
   };

   pub.save = function (articles, callback) {
      pub.getCollection(function (error, collection) {
         var i, article, len, len2, j;
         if (error) {
            callback (error);
         } else {
            if (typeof articles.length === "undefined") {
               articles = [articles];
            }
            len = articles.length;
            for (i = 0; i < len; i++) {
               article = articles[i];
               article.createdAt = new Date();
               if (typeof article.comments === "undefined") {
                  article.comments = [];
               }
               len2 = article.comments.length;
               for (j = 0; j < len2; j++) {
                  article.comments[j].createdAt = new Date();
               }
            }
            collection.insert(articles, function () {
               callback(null, articles);
            });
         }
      });
   };

   priv.server = new mdb.Server(host, port, {auto_reconnect : true}, {});
   priv.db = new mdb.Db('node-mongo-blog-russ', priv.server);
   priv.db.open(function (error, db) {
      if (error) {
         throw (error);
      }
   });

   return pub;
};


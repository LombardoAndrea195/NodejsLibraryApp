
const body_parser = require("body-parser");
const express = require("express");
const server = express();
server.use(body_parser.json());

const port = 4002;

// << db setup >>
const db = require("./db");
const dbName = "users";
const collectionName = "readers";


db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
  // get all items
  dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
        console.log(result);
  });

  // << db CRUD routes >>
  /*
  CREATE: 
  For testing
      $ curl -X POST -H "Content-Type: application/json" --data '
      {
    "email":"francescomasotina@live.it",
    "PreferedBook":[["Harry Potter e La pietra filosofale","J.K.Rowling","26/06/1997"]],
    "BooksRead": ["La pietra filosofale"],
    "notes":[],
    "genre": ["Thriller", "Fantasy"],
    "numberorReviews":0
  }
  ' http://localhost:4002/readers
  */
  server.post("/readers", (request, response) => {
    const item = request.body;
    dbCollection.insertOne(item, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        dbCollection.find().toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            response.json(_result);
        });
    });
});
server.get("/readers", (request, response) => {
  // return updated list
  dbCollection.find().toArray((error, result) => {
      if (error) throw error;
      response.json(result);
  });
});
server.get("/readers/:email", (request, response) => {
  const itemId = request.params.email;

  dbCollection.findOne({ email: itemId }, (error, result) => {
      if (error) throw error;
      // return item
      response.json(result);
  });
});
/*
curl -X PUT -H "Content-Type: application/json" --data '{"BooksRead": ["Il signore degli anelli","parole"] }' http://localhost:4002/readers/francescomasotina@live.it

*/
server.put("/readers/:email", (request, response) => {
  const itemId = request.params.email;
  const item = request.body;
  console.log("Editing item: ", itemId, " to be ", item);


  var myquery={email:String(itemId)};
  ///^Thriller/
  var newvalues = { $set: item };
  dbCollection.updateOne(myquery, newvalues, (error, result) => {
      if (error) throw error;
      // send back entire updated list, to make sure frontend data is up-to-date
      dbCollection.find().toArray(function(_error, _result) {
          if (_error) throw _error;
          response.json(_result);
      });
  });
});

}, function(err) { // failureCallback
  throw (err);
});

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});/*
const MongoClient = require('mongodb').MongoClient; MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000, keepAlive: 1 },function(err, db) {
    if (err) throw err;
    var dbo = db.db("users");
    dbo.collection("readers").insertOne(doc);
});
*/
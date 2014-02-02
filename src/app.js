var express = require('express');
var app = express();
var databaseUrl = "test";
var collections = ["items"];
var db = require("mongojs").connect(databaseUrl, collections);

app.get('/get', function(req, res){
  db.items.find(req.query,function(err,items){
    res.send(items);
  }).count(function(err,res){
    console.log("Requested " + JSON.stringify(req.query) + "; " + res + " items found.");
  });
});
app.get('/create', function(req, res){
  console.log(req.query);
  db.items.insert(req.query,function(err,data){
    res.send(data);
  });
});

app.listen(3000);
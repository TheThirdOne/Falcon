var express = require('express');
var app = express();
var databaseUrl = "test";
var collections = ["items"];
var db = require("mongojs").connect(databaseUrl, collections);
var path = require('path'),
    fs = require('fs');
app.use(express.static(__dirname+'/static'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(express.bodyParser({uploadDir:'./uploads'}));
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
app.post('/create',function(req,res){
  console.log(req.body);
  var ext = path.extname(req.files.file.name).toLowerCase();
  if(ext === '.png' || ext === '.jpeg' || ext === '.jpg' || ext === '.gif'){
    req.body.image = req.files.file.path;
    db.items.insert(req.body,function(err,data){
      res.send(data);
    });
  }else{
    throw 'File type Error'
  }

});
app.listen(3000);
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
  get(req.query,res);
});
app.post('/get', function(req, res){
  get(req.body,res);
});
function get(body,res){
  db.items.find(body,function(err,items){
    res.send(items);
  }).count(function(err,res){
    console.log("Requested " + JSON.stringify(body) + "; " + res + " items found.");
  });
}
app.get('/create', function(req, res){
  console.log(req.query);
  create(req.query,res);
});
app.post('/create',function(req,res){
  console.log(req.body);
  var ext = path.extname(req.files.file.name).toLowerCase();
  if(ext === '.png' || ext === '.jpeg' || ext === '.jpg' || ext === '.gif'){
    req.body.image = req.files.file.path;
    create(req.body,res);
  }else{
    throw 'File type Error';
  }

});
function create(body,res){
  db.items.insert(body,function(err,data){
    res.send(data);
  });
}
app.listen(3000);
var express = require('express');
var app = express();
var databaseUrl = "test";
var collections = ["items"];
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs.connect(databaseUrl, collections);
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
  var skip = body.skip || 0;
  var limit = body.limit || 5;
  delete body.limit;
  delete body.skip;
  db.items.find(body).skip(parseInt(skip)).limit(parseInt(limit),function(err,items){
    res.send(items);
    console.log("Requested " + JSON.stringify(body) + "; " + items.length + " items found.");
  });
}
app.get('/create', function(req, res){
  console.log(req.query);
  create(req.query,res);
});
app.get('/item/:id', function(req, res){
  console.log(req.param("id"));
  db.items.find({_id: ObjectId(req.param("id")) },function(err,items){
    res.send(items);
    console.log("Requested " + req.param("id"));
  });
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
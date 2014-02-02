var express = require('express');
var app = express();
var databaseUrl = "test";
var collections = ["items"];
var db = require("mongojs").connect(databaseUrl, collections);
var path = require('path'),
    fs = require('fs');
app.use(express.static(__dirname+'/static'));
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
  res.send('done');
});
app.post('/upload',function(req,res){
  console.log(req.body);
  var tempPath = req.files.file.path,
      targetPath = path.resolve('./uploads/image.png');
  if (path.extname(req.files.file.name).toLowerCase() === '.png') {
      fs.rename(tempPath, targetPath, function(err) {
          if (err) throw err;
          console.log("Upload completed!");
      });
  } else {
      fs.unlink(tempPath, function () {
          if (err) throw err;
          console.error("Only .png files are allowed!");
      });
  }
  res.send('good');
});
app.listen(3000);
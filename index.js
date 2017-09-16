var express = require('express');
var app = express();
var fs = require("fs");
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/hedgehog');
mongoose.connection.openUri('mongodb://127.0.0.1/hedgehog')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


app.get('/helloworld', function (req, res) {
    res.send("Hello World!");
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)

})


var LocationSchema = mongoose.Schema({  
    name: String
});


var Location = mongoose.model('Location', LocationSchema);

var test = new Location({name: 'TEST'});


test.save(function (err, test) {
    if (err) return console.error(err);
});
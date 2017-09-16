const request = require('request');
var express = require('express')
var app = express()
var mongoose = require('mongoose')
var twitter =  require('./services/twitter')
const router = express.Router()
var cors = require('cors')

// cors
app.use(cors())

// db connection
const db = require('./db')

// connect
db()

app.get('/watch/:hashtag', function (req, res) {
    const hashtag = req.params['hashtag'];
    const result = twitter.watchTag(hashtag);
    res.send(result);
});

app.get('/unwatch/:hashtag', function (req, res) {
    const hashtag = req.params['hashtag'];
    const result = twitter.unwatchTag(hashtag);
    res.send(result);
});


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})

const productsController = require('./api/products')

router.get('/products/search', productsController.search);

app.use('/api', router)
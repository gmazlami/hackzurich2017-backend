const request = require('request');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const twitter =  require('./services/twitter')
const router = express.Router()
const cors = require('cors')
const local = require('./../local.js');

for (const key in local) {
    if (local.hasOwnProperty(key)) {
        process.env[key] = local[key];
    }
}

// Just to demo: That's how to get a sentiment
require('./services/sentiment').getSentiment("No Man's Sky sucks");

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
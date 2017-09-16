const request = require('request');
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const twitter =  require('./services/twitter')
const router = express.Router()
const cors = require('cors')
const local = require('./../local.js');
var Contract = require('./models/contract')

for (const key in local) {
    if (local.hasOwnProperty(key)) {
        process.env[key] = local[key];
    }
}

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
const contractsController = require('./api/contracts')
const tweetController = require('./api/tweet')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

router.get('/products/search', productsController.search);
router.get('/products/:id', productsController.get);
router.get('/tweet', tweetController.get);
router.post('/contracts', contractsController.post);

app.use('/api', router)
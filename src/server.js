const request = require('request');
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const twitter =  require('./services/twitter')
const router = express.Router()
const cors = require('cors')
const local = require('./../local.js');
var Contract = require('./models/conctract')

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

var product = {
  "description": "Testdescription",
  "ean": "5035225121402",
  "price": 2790,
  "images": {
  "highres": "https://cdn.siroop.ch/media/images/sized/dd/54/39/dd5439b08ec6c15cf67a95a1c095ecac.400x400.jpg",
  "lowres": "https://cdn.siroop.ch/media/images/sized/dd/54/39/dd5439b08ec6c15cf67a95a1c095ecac.200x200.jpg",
  "thumbnails": "https://cdn.siroop.ch/media/images/sized/dd/54/39/dd5439b08ec6c15cf67a95a1c095ecac.50x50.jpg"
  },
  "id": 1729438,
  "categories": [
    "Xbox One Games",
    "Games",
    "Medien & Unterhaltung"
  ],
  "sku": "750706-A",
  "name": "Fifa 16",
  "url": "/medien-unterhaltung/games/xbox-one-games/fifa-16-0750706",
  "tags": [
    "Games",
    "Medien & Unterhaltung",
    "Xbox One Games"
  ],
  "l1_category_url": "/medien-unterhaltung",
  "l2_category_url": "/medien-unterhaltung/games",
  "l3_category_url": "/medien-unterhaltung/games/xbox-one-games",
  "brand": "EA Sports",
  "sentiment": 0.29440694061236616
  }

  var contract = Contract({product: product});
  contract.save();


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})

const productsController = require('./api/products')
const contractsController = require('./api/contracts')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

router.get('/products/search', productsController.search);
router.post('/contracts', contractsController.post);
app.use('/api', router)
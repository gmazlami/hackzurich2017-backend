const request = require('request');
var express = require('express')
var app = express()
var mongoose = require('mongoose')
const router = express.Router()
var cors = require('cors')

// cors
app.use(cors())

// db connection
const db = require('./db')

// connect
db()

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})

const productsController = require('./api/products')

router.get('/products/search', productsController.search);

app.use('/api', router)
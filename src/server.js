var express = require('express')
var app = express()
var mongoose = require('mongoose')
const router = express.Router()

// db connection
const db = require('./db')

// connect
db()

app.get('/helloworld', function (req, res) {
    res.send("Hello World!");
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})

const productsController = require('./api/products')

router.get('/products/:id', productsController.get)

app.use('/api', router)
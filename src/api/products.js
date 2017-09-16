const request = require('request');
const InsuranceService = require('../services/insurance');
const DEMO_PRODUCT_EAN = "5030930121822";
const DEMO_PRODUCT_SENTIMENT = "0.7";

const generateRandomSentiment = () => {
  const absoluteVal = Math.random();
  const multiplicator = Math.random() > 0.5 ? -1 : 1;
  return absoluteVal * multiplicator;
}

const enrichProduct = (product) => {
  if (product["ean"] === DEMO_PRODUCT_EAN) {
    product.sentiment = DEMO_PRODUCT_SENTIMENT;
  } else {
    product.sentiment = generateRandomSentiment();
  }

  product.insurancePrice = InsuranceService.computeInsurancePrice(product.price, product.sentiment)

  return product;
}

exports.get = (req, res) => {
  request('https://api.siroop.ch/product/concretes/sku/' + req.params.id + '?apikey=8ccd66bb1265472cbf8bed4458af4b07', { json: true }, (err, result, body) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }

    let product = enrichProduct(body[0])
    return res.status(200).json(product)
  });
}

exports.search = (req, res) => {
  var query = req.query.query;
  var queryText = encodeURIComponent(query);

  request('https://api.siroop.ch/product/search/?query=' + queryText + '&limit=200&category=%2Fmedien-unterhaltung%2Fgames&apikey=8ccd66bb1265472cbf8bed4458af4b07', { json: true }, (err, result, body) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }
    
    for (var i = 0; i < body.length; i++) {
      body[i] = enrichProduct(body[i])
    }

    return res.status(200).json(body)
  });

}

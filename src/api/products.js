const request = require('request');
const InsuranceService = require('../services/insurance');

const DEMO_PRODUCTS = {
    "711719814559":   0.9, // 'no mans sky'
    "0711719849933":  0.9, // 'no mans sky'
    "711719849933":   0.9, // 'no mans sky'
    "5030948116414":  0.0, // 'fifa 17'
    "5030930121822":  0.0,
    "5030938116387":  0.0,
    "5030938116424":  0.0,
    "5030933116436":  0.0,
    "5035225116378":  0.0,
    "5030938116387":  0.0,
    "5030947116958":  0.0,
    "5030938116424":  0.0,
    "5030944116340":  0.0,
    "5035228116955":  0.0,
    "5030938116387":  0.0,
    "5030949116437":  0.0,
    "5030944116340":  0.0,
};

const generateRandomSentiment = () => {
  const absoluteVal = Math.random();
  const multiplicator = Math.random() > 0.5 ? -1 : 1;
  return absoluteVal * multiplicator;
}

const enrichProduct = (product) => {
  let demoSentiment = DEMO_PRODUCTS[product["ean"]];
  if (demoSentiment !== undefined) {
    product.sentiment = demoSentiment;
  } else {
    product.sentiment = generateRandomSentiment();
  }

  product.insurancePrice = InsuranceService.computeInsurancePrice(product.price, product.sentiment)

  return product;
}

exports.get = (req, res) => {

  request('https://api.siroop.ch/product/ean/' + req.params.id + '/?apikey=8ccd66bb1265472cbf8bed4458af4b07', { json: true }, (err, result, body) => {
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

  request('https://api.siroop.ch/product/search/?query=' + queryText + '&limit=20&category=%2Fmedien-unterhaltung%2Fgames&apikey=8ccd66bb1265472cbf8bed4458af4b07', { json: true }, (err, result, body) => {
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

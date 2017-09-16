const request = require('request');
var Contract = require('../models/contract');

const INSURANCE_FORMULA_SLOPE = -12.5
const INSURANCE_FORMULA_OFFSET = 17.5

exports.post = (req, res) => {
    var productEan = req.body.productEan;
    var productSentiment = req.body.productSentiment;

    request('https://api.siroop.ch/product/ean/'+ productEan +'/?apikey=8ccd66bb1265472cbf8bed4458af4b07',{ json: true }, (err, result, body) => {
        if (err) { 
          console.log(err); 
          return res.status(500);
        }
        var insurancePrice = computeInsurancePrice(body.price, body.sentiment);
        
        var contract = Contract({product: body, insurancePrice: insurancePrice, productPrice: body.productPrice});
        contract.save();
        console.log(contract)

        return res.status(200).json(contract);
    });
}


var computeInsurancePrice = (price, sentiment) => {
    return ((INSURANCE_FORMULA_SLOPE * sentiment + INSURANCE_FORMULA_OFFSET)/100) * price
}
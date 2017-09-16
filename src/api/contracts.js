const request = require('request');
const InsuranceService = require('../services/insurance');
const Contract = require('../models/contract');

exports.post = (req, res) => {
    var productEan = req.body.productEan;
    var productSentiment = req.body.productSentiment;

    request('https://api.siroop.ch/product/ean/' + productEan + '/?apikey=8ccd66bb1265472cbf8bed4458af4b07', { json: true }, (err, result, body) => {
        if (err) {
            console.log(err);
            return res.status(500);
        }

        const contract = Contract();
        contract.insurancePrice = InsuranceService.computeInsurancePrice(body[0].price, productSentiment);
        contract.product = body[0];
        contract.save();
        
        return res.status(200).json(contract);
    });
}
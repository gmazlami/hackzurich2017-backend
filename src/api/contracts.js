const request = require('request');
const InsuranceService = require('../services/insurance');
const TwitterService = require('../services/twitter');
const Contract = require('../models/contract');
const Tweet = require('../models/contract');

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
        const tag = body[0].name.toLowerCase().replace(/\W/g, '');
        contract.tag = tag;
        contract.save();

        TwitterService.watchTag(tag);

        setTimeout(() => {
            TwitterService.unwatchTag(tag);
        }, 5000);
        
        return res.status(200).json(contract);
    });
}


exports.get = (req, res) => {

    const id = req.params.id;

    Contract.find({"product.ean":id}).limit(1).exec((err, contract) => {
        if (err) {
            console.log(err);
            return res.status(500);
        }

        Tweet.find({"tag": contract.tag}).sort({"sentiment": -1}).limit(3).exec((err, bestTweets) => {
            if (err) {
                console.log(err);
                return res.status(500);
            }

            contract.bestTweets = bestTweets;

            Tweet.find({"tag": contract.tag}).sort({"sentiment": 1}).limit(3).exec((err, worstTweets) => {
                if (err) {
                    console.log(err);
                    return res.status(500);
                }

                contract.worstTweets = worstTweets;
            })

        });

        console.log(contract);
        return res.status(200).json(contract);
    });
}

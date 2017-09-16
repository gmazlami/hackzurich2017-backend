const request = require('request');
const InsuranceService = require('../services/insurance');
const TwitterService = require('../services/twitter');
const Contract = require('../models/contract');
<<<<<<< HEAD
const Tweet = require('../models/tweet');
=======
const Tweet = require('../models/contract');
const Pushpad = require('../services/pushpad');
>>>>>>> 9dd1775a9111b393d37c8ce1742fbd84994928bc

exports.post = (req, res) => {
    var productEan = req.body.productEan;
    var productSentiment = req.body.productSentiment;

    request('https://api.siroop.ch/product/ean/' + productEan + '/?apikey=8ccd66bb1265472cbf8bed4458af4b07', { json: true }, (err, result, body) => {
        if (err) {
            console.log(err);
            return res.status(500);
        }

        let product = body[0];
        let tag = product.name.toLowerCase().replace(/\W/g, '')

        Contract.findOneAndUpdate({ "product.ean": product.ean }, { 
            insurancePrice: InsuranceService.computeInsurancePrice(body[0].price, productSentiment),
            product: product,
            tag: tag
        }, { upsert: true, new: true }, (err, contract) => {
            if (err) {
                console.log(err)
                return res.status(500).send();
            }
            
            TwitterService.watchTag(tag);

            setTimeout(() => {
                TwitterService.unwatchTag(tag);
                var notification = Pushpad.createNotification('RELEASE: ' + contract.product.name,'Your insured product was released, and reviews have been analyzed.','http://localhost:4200/voucher/'+contract.product.ean,'');
                notification.broadcast({},() => {});      
            }, 5000);

            return res.status(201).json(contract);
        })
    });
}


exports.get = (req, res) => {

    const id = req.params.id;

    Contract.findOne({ "product.ean": id }).exec((err, contract) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        contract = contract.toObject();

        Tweet.find({ "tag": contract.tag }).sort({"sentiment": -1}).limit(3).exec((err, bestTweets) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }

            contract.bestTweets = bestTweets;

            Tweet.find({"tag": contract.tag}).sort({"sentiment": 1}).limit(3).exec((err, worstTweets) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send();
                }

                contract.worstTweets = worstTweets;
                return res.status(200).json(contract);
            })

        });

    });
}

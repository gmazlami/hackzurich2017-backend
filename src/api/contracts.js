const request = require('request');
const InsuranceService = require('../services/insurance');
const TwitterService = require('../services/twitter');
const Contract = require('../models/contract');
const Tweet = require('../models/tweet');
const Pushpad = require('../services/pushpad');
const io = require('../io')
const _ = require('lodash');

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
                var notification = Pushpad.createNotification(('RELEASE: ' + contract.product.name).substr(0, 30), 'Your insured product was released, and reviews have been analyzed.', 'http://localhost:4200/voucher/' + contract.product.ean, contract.product.images.highres);
                notification.broadcast({}, (err) => {
                    console.log(err)
                    console.log('broadcasted')
                });
            }, 10000);

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

        let avg = {};
        avg.sentiment = 0;
        avg.anger = 0;
        avg.disgust = 0;
        avg.fear = 0;
        avg.joy = 0;
        avg.sadness = 0;

        // stop watching this now
        TwitterService.unwatchTag(contract.tag);

        Tweet.find({ "tag": contract.tag }).sort({sentiment: -1}).exec((err, tweets) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }

            contract.bestTweets = _.slice(tweets, 0, 3);
            contract.worstTweets = _.slice(_.reverse(tweets), 0, 3);

            _.forEach(tweets, (tweet) => {
               avg.sentiment += tweet.sentiment;
               avg.anger += tweet.emotion.anger;
               avg.disgust += tweet.emotion.disgust;
               avg.fear += tweet.emotion.fear;
               avg.joy += tweet.emotion.joy;
               avg.sadness += tweet.emotion.sadness;
            });

            avg.sentiment /= tweets.length;
            avg.anger /= tweets.length;
            avg.disgust /= tweets.length;
            avg.fear /= tweets.length;
            avg.joy /= tweets.length;
            avg.sadness /= tweets.length;

            contract.avg = avg;

            return res.status(200).json(contract);

        });

    });
}

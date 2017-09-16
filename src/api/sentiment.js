const sentimentService = require('./../services/sentiment');

exports.get = (req, res) => {

    const text = req.body.text;

    sentimentService.getSentiment(text)
        .then( (result) => {
            res.send(result);
        })
        .catch( (error) => {
            res.status(500).send(error);
        })

}
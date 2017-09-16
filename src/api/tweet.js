const sentimentService = require('./../services/sentiment');

exports.get = (req, res) => {

    const text = req.param('tag');

    sentimentService.getSentiment(text)
        .then( (result) => {
            res.send(result);
        })
        .catch( (error) => {
            res.status(500).send(error);
        })

}
'use strict';

module.exports.getSentiment = function (text) {
    const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

    const nlu = new NaturalLanguageUnderstandingV1({
        // credentials are pulled from environment properties:
        // NATURAL_LANGUAGE_UNDERSTANDING_USERNAME & NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD
        version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
    });

    const options = {
        text: text,
        features: {
            sentiment: {},
            emotion: {}
        }
    };

    return new Promise((resolve, reject) => {
        nlu.analyze(options, function (err, res) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(JSON.stringify(res));
            resolve(res);
        });
    })
};

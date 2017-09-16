const Twitter = require('twitter');
const config = require('./../../local.js');
const _ = require('lodash');
const Tweet = require('./../models/tweet');
const sentimentService = require('./../services/sentiment');

const t = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

let watchedTags = [];

let stream = null;

const stopStream = () => {
    if (stream !== null) {
        stream.destroy();
        stream = null;
    }
};

const startStream = () => {

    // Check if there is a phrase at all --> prevents error if all are unmonitored
    if (watchedTags.length === 0) {
        console.log("No tags...");
        stopStream();
        return;
    }

    stream = t.stream('statuses/filter', {track: watchedTags.join(","), language: 'en'});

    stream.on('data', function (event) {
        console.log(event && event.text);
        const tweet = new Tweet();
        tweet.text = event.text;
        tweet.tags = [];
        let foundTag = false;
        _.forEach(watchedTags, (tag) => {
            if (event.text.toLowerCase().indexOf(tag.toLowerCase()) > -1 && !foundTag) {
                tweet.tag = tag;
                foundTag = true;
            }
        });
        sentimentService.getSentiment(tweet.text)
            .then( (response) => {
                console.log(JSON.stringify(response));
                tweet.sentiment = response.sentiment.document.score;
                tweet.emotion = response.emotion.document;
                return tweet.save()
            })
            .then( (response) => {
                console.log("All good, saved:");
                console.log(response);
            })
            .catch( (error) => {
                console.log(JSON.stringify(error));
            });
    });

    stream.on('error', function (error) {
        console.log('Error: ' + error.toString());
    });


    stream.on('end', function () {
        console.log('End');
        setTimeout(function () {
            console.log('Recovering... ');
            restartStream();
        }, 2500);
    });

};

const restartStream = () => {
    console.log("Restarting stream...");
    if (stream !== null) {
        stopStream();
    } else {
        startStream();
    }
};

module.exports.watchTag = (tag) => {
    console.log('watching', tag);
    if (_.indexOf(watchedTags, tag) === -1) {
        watchedTags.push(tag);
        restartStream();
        return "ok"
    }
    return "nothing done - is already watched. Currently watched: " + watchedTags;
};

module.exports.unwatchTag = (tag) => {
    if (_.indexOf(watchedTags, tag) > -1) {
        _.pull(watchedTags, tag);
        restartStream();
        return "ok"
    }
    return "nothing done, not in the watched tags. Currently watched: " + watchedTags;
};

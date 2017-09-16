const Twitter = require('twitter');
const config = require('./../../local.js');

const t = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

const tags = {};

let stream = null;

const stopStream = () => {
    if (stream !== null) {
        stream.destroy();
        stream = null;
    }
};

const startStream = () => {
   stream = t.stream('statuses/filter', {track: Object.keys(tags), language: 'en'});

    stream.on('data', function(event) {
        console.log(event && event.text);
    });

    stream.on('error', function (error) {
        console.log('Error: ' + error.toString());
    });


    stream.on('end', function () {
        console.log('Terminated.');
        setTimeout(function() {
            console.log('Recovering... ');
            restartStream();
        }, 2500);
    });

};

const restartStream = () => {
    stopStream();
    startStream();
};

module.exports.watchTag = (hashtag) => {
    if (!(hashtag in tags)) {
        //tags[hashtag] = true;
        tags[hashtag] = true;
        restartStream();
        return "ok"
    }
    return "nothing done"
};

module.exports.unwatchTag = (hashtag) => {
    if (hashtag in tags) {
        delete tags[hashtag];
        restartStream();
        return "ok"
    }
    return "nothing done"
};

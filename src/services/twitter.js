const Twitter = require('twitter');
const t = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

const tags = {};

let stream = undefined;

const stopStream = () => {
    if (stream !== undefined) {
        stream.destroy();
        stream = null;
    }
};

const startStream = () => {
    stream = t.stream('statuses/filter', {track: Object.keys(tags).join(',')});

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
    setTimeout( () => startStream(), 2500);
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

const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        sentiment: {type: Number},
        emotion: {type: Object},
        tweets: {type: Array},
    },
    { 
        timestamps: true 
    }
)

const model = mongoose.model('Sentiment', schema);

module.exports = model;

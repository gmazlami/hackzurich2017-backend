const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        sentiment: {type: Number},
        emotion: {type: Object},
        text: {type: String},
        tag: {type: String},
    },
    {
        timestamps: true 
    }
)

const model = mongoose.model('Tweet', schema);

module.exports = model;

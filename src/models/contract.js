const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        product: Object
    }, 
    { 
        timestamps: true 
    }
)

const model = mongoose.model('Contract', schema)

module.exports = model

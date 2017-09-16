const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        product: {type: Object},
        productPrice: {type: Number},
        insurancePrice: {type: Number},
    },
    { 
        timestamps: true 
    }
)

const model = mongoose.model('Contract', schema)

module.exports = model

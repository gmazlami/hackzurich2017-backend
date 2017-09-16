const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        product: { type: Object },
        productPrice: { type: Number },
        insurancePrice: { type: Number },
        tag: { type: String }
    },
    {
        timestamps: true
    }
)

const model = mongoose.model('Contract', schema)

module.exports = model

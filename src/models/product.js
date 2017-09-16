const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  ean: { type: String, required: true },
  tags: [
    { type: String }
  ],
  historic: [
    { type: Number }
  ]
}, { timestamps: true })

const model = mongoose.model('Product', schema)

module.exports = model

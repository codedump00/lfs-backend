const mongoose = require("mongoose")

const Card = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    offer: {
        discount: {
            type: String,
            required: true
        },
        product: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Card", Card)

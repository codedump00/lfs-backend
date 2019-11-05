const mongoose = require("mongoose")

const Card = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: String
    },
    card: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Card", Card)

const mongoose = require("mongoose")

const Merchant = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        // eslint-disable-next-line security/detect-unsafe-regex
        match:  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    media: {
        type: String
    }
})

module.exports = mongoose.model("Merchant", Merchant)

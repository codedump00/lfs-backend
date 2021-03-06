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
        match: /^(([^<>()[\].,;:s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/
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
    }
})

module.exports = mongoose.model("Merchant", Merchant)

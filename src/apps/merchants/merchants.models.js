const mongoose = require("mongoose");

const Merchant = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        sparse: true,
        // eslint-disable-next-line security/detect-unsafe-regex
        match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: Array
    },
    contact: {
        type: String
    },
    category: {
        type: String
    },
    discount: {
        type: String
    },
    timestamp: {
        type: Date,
        required: true
    },
    media: {
        type: Object
    },
    hours: {
        type: String,
        default: "8 am - 12 pm"
    }
});

module.exports = mongoose.model("Merchant", Merchant);

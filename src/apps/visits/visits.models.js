const mongoose = require("mongoose");

const Visit = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timestamp: [
        {
            type: Date,
            required: true
        }
    ]
});

module.exports = mongoose.model("Visit", Visit);

const mongoose = require("mongoose")

const Bookmarks = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    bookmarks: [{ type: string }],
    timestamp: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Bookmarks", Bookmarks)

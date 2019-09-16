const Bookmark = require("./bookmarks.models")

const register = async (req, res) => {
    try {
        const bookmark = Bookmark({
            user: req.userData.userId,
            bookmarks: req.body.bookmarks,
            timestamp: Date.now()
        })
        await bookmark.save()
        return res.status(200).json({
            message: "Bookmark created!",
            id: await bookmark._id
        })
    } catch (e) {
        return res.status(400).json({
            error: "Error courred!"
        })
    }
}

const find = async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id)
        return res.status(200).json({
            result: bookmark
        })
    } catch (e) {
        return res.status(400).json({
            error: "Bookmarks not found!"
        })
    }
}

const del = async (req, res) => {
    try {
        await Bookmark.deleteOne({ _id: req.body.id })
        return res.status(200).json({
            message: "Bookmark deleted!"
        })
    } catch (e) {
        return res.status(400).json({
            error: "Bookmark not found!"
        })
    }
}

const update = async (req, res) => {
    try {
        await Bookmark.updateOne({ user: req.userData.userId }, req.body)
        return res.status(200).json({
            result: "Bookmarks updated successfully!"
        })
    } catch (e) {
        return res.status(400).json({
            result: "Error ocurred updating bookmarks!"
        })
    }
}

module.exports = { register, delete: del, find, update }

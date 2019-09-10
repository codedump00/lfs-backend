const Card = require("../models/cards")

const register = async (req, res) => {
    try {
        const card = Card({
            merchant: req.userData.userId,
            offer: {
                discount: req.body.discount,
                product: req.body.product
            },
            category: req.body.category,
            timestamp: req.body.timestamp
        })
        await card.save()
        return res.status(200).json({
            message: "Card created!",
            id: await card._id
        })
    } catch (e) {
        return res.status(400).json({
            error: "Error courred!"
        })
    }
}

const find = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
        return res.status(200).json({
            result: card
        })
    } catch (e) {
        return res.status(400).json({
            error: "Card not found!"
        })
    }
}

const category = async (req, res) => {
    try {
        const card = await Card.find({ category: req.params.category })
        return res.status(200).json({
            result: card
        })
    } catch (e) {
        return res.status(400).json({
            error: "Card not found!"
        })
    }
}

const del = async (req, res) => {
    try {
        await Card.deleteOne({ _id: req.body.id })
        return res.status(200).json({
            message: "Card deleted!"
        })
    } catch (e) {
        return res.status(400).json({
            error: "Card not found!"
        })
    }
}

module.exports = { register, delete: del, find, category }

const Card = require("./cards.models");

const register = async (req, res) => {
    try {
        const card = Card({
            user: req.body.user || "",
            card: req.body.card,
            timestamp: Date.now()
        });
        await card.save();
        return res.status(200).json({
            message: "Card created!",
            card: card
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error courred!"
        });
    }
};

const find = async (req, res) => {
    try {
        const card = await Card.findOne({ card: req.params.card });
        return res.status(200).json({
            result: card
        });
    } catch (e) {
        return res.status(400).json({
            error: "Card not found!"
        });
    }
};

const get = async (req, res) => {
    try {
        const cards = await Card.find({});
        return res.status(200).json({
            result: cards
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const update = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        card.name = req.params.name;
        await card.save();
        return res.status(200).json({
            message: "Card updated successfully!",
            card: card
        });
    } catch (e) {}
};

const del = async (req, res) => {
    try {
        await Card.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Card deleted!"
        });
    } catch (e) {
        return res.status(400).json({
            error: "Card not found!"
        });
    }
};

module.exports = { register, delete: del, find, get, update };

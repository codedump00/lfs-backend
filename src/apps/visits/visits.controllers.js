const mongoose = require("mongoose");
const Visit = require("./visits.models");
const Card = require("../cards/cards.models");
const User = require("../users/users.models");

const create = async (req, res) => {
    try {
        const visit = Visit({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.user,
            merchant: req.body.merchant,
            timestamp: [req.body.timestamp]
        });
        await visit.save();
        return res.status(200).json({
            message: "Visit created!",
            visit: visit
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!",
            err: e
        });
    }
};

const get = async (req, res) => {
    try {
        const visits = await Visit.find({
            user: req.params.user,
            merchant: req.params.merchant
        });

        return res.status(200).json({
            result: visits
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const update = async (req, res) => {
    try {
        const visit = await Visit.findOne({
            user: req.body.user,
            merchant: req.body.merchant
        });
        visit.timestamp.push(req.body.timestamp);
        await visit.save();
        return res.status(200).json({
            message: "Visit updated successfully!",
            visit: visit
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const del = async (req, res) => {
    try {
        await Visit.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Visit deleted!"
        });
    } catch (e) {
        return res.status(400).json({
            error: "Visit not found!"
        });
    }
};

const search = async (req, res) => {
    try {
        const card = await Card.findOne({ card: req.params.card });
        console.log(card);
        if (card) {
            const user = await User.findOne(
                { card_id: req.params.card },
                "_id name card_id"
            );
            return res.status(200).json({
                user: user
            });
        }
        return res.status(400).json({
            error: "Card not found!"
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: "Error ocurred!",
            e: e
        });
    }
};

module.exports = { create, delete: del, get, update, search };

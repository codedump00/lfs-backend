const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Merchant = require("../models/merchants")

const signup = async (req, res) => {
    try {
        const stored = await Merchant.find({ email: req.body.email })
        if (stored.length > 0)
            return res.status(409).json({
                message: "Account creation failed. Merchant exists."
            })

        const hash = await bcrypt.hash(req.body.password, 10)
        const merchant = Merchant({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        await merchant.save()
        return res.status(201).json({
            message: "Merchant Created"
        })
    } catch(err) {
        res.status(400).json({
            message: "Sign up failed!"
        })
    }
}

const login = async (req, res) => {
    try {
        const data = await Merchant.findOne(
            { email: req.body.email },
            "type email password _id"
        )
        const ok = await bcrypt.compare(req.body.password, data.password)
        if (ok) {
            const tok = jwt.sign(
                {
                    email: data.email,
                    userId: data._id
                },
                // eslint-disable-next-line no-undef
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )
            return res.status(200).json({
                token: tok,
                id: data._id
            })
        }
    } catch(err) {
        return res.status(400).json({
            error: "Error logging in!!!"
        })
    }
}

const findByID = async (req, res) => {
    try {
        const merchant = await Merchant.findById(req.userData.userId, "name email address")
        return res.status(200).send({
            result: merchant
        })
    } catch(err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        })
    }
}

const findByName = async (req, res) => {
    try {
        const merchant = await Merchant.findOne(
            { name: req.params.userName },
            "email name address"
        )
        return res.status(201).json({
            result: merchant
        })
    } catch(err) {
        return res.status(400).json({
            error: "Illegal parameters!!"
        })
    }
}

const update = async (req, res) => {
    try {
        await Merchant.findByIdAndUpdate(req.userData.userId, req.body, {
            new: true
        })
        return res.status(200).json({
            message: "Profile updated successfully."
        })
    } catch (err){
        return res.status(500).json({
            error: "Error occured!!"
        })
    }
}

const del = async (req, res) => {
    try {
        await Merchant.deleteOne({ _id: req.userData.userId })
        return res.status(200).json({
            message: "Merchant deleted"
        })
    } catch (err){
        return res.status(400).json({
            error: "Illegal action!!"
        })
    }
}

module.exports = {
    signup,
    login,
    findByID,
    findByName,
    update,
    delete: del
}

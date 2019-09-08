const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../models/users")

const signup = async (req, res) => {
    try {
        const stored = await User.find({ email: req.body.email })
        if (stored.length > 0)
            return res.status(409).json({
                message: "Account creation failed. User exists."
            })

        const hash = await bcrypt.hash(req.body.password, 10)
        const user = User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        await user.save()
        return res.status(201).json({
            message: "User Created"
        })
    } catch(err) {
        res.status(400).json({
            message: "Sign up failed!"
        })
    }
}

const login = async (req, res) => {
    try {
        const data = await User.findOne(
            { email: req.body.email },
            "type email password _id"
        )
        const ok = await bcrypt.compare(req.body.password, data.password)
        if (ok) {
            const tok = jwt.sign(
                {
                    email: data.email,
                    userId: data._id,
                    type: data.type
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
        const user = await User.findById(req.userData.userId, "name email type")
        return res.status(200).send({
            result: user
        })
    } catch(err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        })
    }
}

const findByUName = async (req, res) => {
    try {
        const user = await User.findOne(
            { name: req.params.userName },
            "email name"
        )
        return res.status(201).json({
            result: user
        })
    } catch(err) {
        return res.status(400).json({
            error: "Illegal parameters!!"
        })
    }
}

const update = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userData.userId, req.body, {
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
        await User.deleteOne({ _id: req.userData.userId })
        return res.status(200).json({
            message: "User deleted"
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
    findByUName,
    update,
    delete: del
}

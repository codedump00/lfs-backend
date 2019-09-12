const bcrypt = require("bcrypt")
const axios = require("axios")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("./users.models")
const builder = require("./url.builder")

const signup = async (req, res) => {
    try {
        const stored = await User.find({ email: req.body.email })
        if (stored.length > 0)
            return res.status(409).json({
                error: "Account creation failed. User exists."
            })

        const user = User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            verified: await bcrypt.hash(
                `${req.body.email.split("@")[1]},
                ${Math.random()},
                ${Date.now()},~:'`,
                10
            ),
            timestamp: Date.now()
        })
        await user.save()
        axios({
            method: "POST",
            url: "https://lightmailer.herokuapp.com/mailer",
            data: {
                to: `${req.body.email}`,
                subject: "User Verification",
                text: `
                    Please visit the url below to confirm your identity:\n
                    http://localhost:3000/users/verify/${user._id}/by/${user.verified}`
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => {
                // console.log(data)
                return res.status(201).json({
                    result:
                        "User Created! Please open your mail and confirm your identity!"
                })
            })
            .catch(() => {
                res.status(400).json({
                    result: "Error sending confirmation link!!"
                })
            })
    } catch (err) {
        res.status(400).json({
            error: "Sign up failed!",
            err: err
        })
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user.verified === "true") {
            const ok = await bcrypt.compare(req.body.password, user.password)
            if (ok) {
                const tok = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id,
                        type: user.type
                    },
                    // eslint-disable-next-line no-undef
                    process.env.LFS_SECRET,
                    {
                        expiresIn: "1d"
                    }
                )
                return res.status(200).json({
                    token: tok,
                    id: user._id
                })
            }
            return res.status(400).json({
                error: "User verification failed!"
            })
        }
        return res.status(400).json({
            error: "Not verified!"
        })
    } catch (err) {
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
    } catch (err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        })
    }
}

const findByName = async (req, res) => {
    try {
        const user = await User.findOne(
            { name: req.params.userName },
            "email name"
        )
        return res.status(201).json({
            result: user
        })
    } catch (err) {
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
            result: "Profile updated successfully."
        })
    } catch (err) {
        return res.status(500).json({
            error: "Error occured!!"
        })
    }
}

const del = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.userData.userId })
        return res.status(200).json({
            result: "User deleted"
        })
    } catch (err) {
        return res.status(400).json({
            error: "Illegal action!!"
        })
    }
}

const verify = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }, "verified")
        if (req.params.token === user.verified) {
            user.verified = "true"
            user.save()
            return res.status(200).json({
                result: "User verified!"
            })
        }
        return res.staus(400).json({
            error: "User verification failed!"
        })
    } catch (e) {
        return res.status(400).json({
            error: "User verification failed!"
        })
    }
}

module.exports = {
    signup,
    login,
    findByID,
    findByName,
    update,
    verify,
    delete: del
}

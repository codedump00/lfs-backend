const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Merchant = require("./merchants.models")
const { upload, remove } = require("../../firebase/uploader")

const signup = async (req, res) => {
    try {
        const stored = await Merchant.find({ name: req.body.name })
        if (stored.length > 0)
            return res.status(409).json({
                message: "Account creation failed. Merchant exists."
            })

        const hash = await bcrypt.hash(req.body.password, 10)
        const merchant = Merchant({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            category: req.body.category,
            password: hash,
            timestamp: Date.now()
        })
        await merchant.save()
        return res.status(201).json({
            message: "Merchant Created"
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: "Sign up failed!"
        })
    }
}

const login = async (req, res) => {
    try {
        const data = await Merchant.findOne(
            { name: req.body.name },
            "name password _id"
        )
        const ok = await bcrypt.compare(req.body.password, data.password)
        if (ok) {
            const tok = jwt.sign(
                {
                    name: data.name,
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
    } catch (err) {
        return res.status(400).json({
            error: "Error logging in!!!"
        })
    }
}

const get = async (req, res) => {
    try {
        const merchants = await Merchant.find(
            {},
            "name address location contact category timestamp media"
        )
        return res.status(200).send({
            result: merchants
        })
    } catch (err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        })
    }
}

const findByID = async (req, res) => {
    try {
        const merchant = await Merchant.findById(
            req.userData.userId,
            "name email address"
        )
        return res.status(200).send({
            result: merchant
        })
    } catch (err) {
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
    } catch (err) {
        return res.status(400).json({
            error: "Illegal parameters!!"
        })
    }
}


const category = async (req, res) => {
    try {
        const merchants = await Merchant.find({
            category: {
                $regex: RegExp(`${req.params.category}`),
                $options: "i"
            }
        })
        return res.status(200).json({
            result: merchants
        })
    } catch (e) {
        return res.status(400).json({
            error: "Merchants not found!"
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
    } catch (err) {
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
    } catch (err) {
        return res.status(400).json({
            error: "Illegal action!!"
        })
    }
}

const imageUpload = async (req, res) => {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    try {
        const media = await upload(req.files)
        if (media.error)
            return res.status(400).json({
                error: "Image uploading failed."
            })
        await Merchant.findByIdAndUpdate(req.userData.userId, {
            media: media
        })
        return res.status(201).json({
            media: media
        })
    } catch (err) {
        return res.status(400).json({
            error: "Image uploading failed."
        })
    }
}

module.exports = {
    signup,
    login,
    get,
    findByID,
    findByName,
    update,
    delete: del,
    upload: imageUpload,
    category
}

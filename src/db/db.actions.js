const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const legalUserUpdates = ["name", "password"]

const signup = async data => {
    try {
        if (data.name && data.email && data.password)
            return Object.freeze({
                _id: new mongoose.Types.ObjectId(),
                name: data.name,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                verified: await bcrypt.hash(
                    `${data.email.split("@")[1]},
                    ${Math.random()},
                    ${Date.now()},~:'`,
                    10
                ),
                timestamp: Date.now()
            })
        throw Error("Parameters not supplied properly!")
    } catch (err) {
        throw Error("Parameters not supplied properly!")
    }
}

const updateNamePwd = async data => {
    try {
        Object.keys(data).filter(keys => {
            if (!legalUserUpdates.includes(keys))
                throw Error("Parameters not supplied properly!")
        })
        if (data.name && data.password)
            return Object.freeze({
                name: data.name,
                password: data.password
            })
        if (data.name && !data.password)
            return Object.freeze({
                name: data.name
            })
        if (!data.name && data.password)
            return Object.freeze({
                password: data.password
            })

        throw Error("Parameters not supplied properly!")
    } catch (err) {
        throw Error("Parameters not supplied properly!")
    }
}

const verifyUser = async (user, pwd) => {
    try {
        if (await bcrypt.compare(pwd, user.password)) {
            return jwt.sign(
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
        }
        throw Error("Error verifying user!")
    } catch (e) {
        throw Error("Error verifying user!")
    }
}

const card = async req => {
    try {
        if (req.body.discount && req.body.product && req.body.category)
            return Object.freeze({
                merchant: req.userData.userId,
                offer: {
                    discount: req.body.discount,
                    product: req.body.product
                },
                category: req.body.category,
                timestamp: Date.now()
            })
        throw Error("Parameters not supplied properly!")
    } catch (e) {
        throw Error("Parameters not supplied properly!")
    }
}

const bookmark = async req => {
    try {
        if (req.body.bookmarks)
            return Object.freeze({
                user: req.userData.userId,
                bookmarks: req.body.bookmarks,
                timestamp: Date.now()
            })
        throw Error("Parameters not supplied properly!")
    } catch (e) {
        throw Error("Parameters not supplied properly!")
    }
}

module.exports = {
    userSignup: signup,
    userUpdate: updateNamePwd,
    verifyUser,
    card
}

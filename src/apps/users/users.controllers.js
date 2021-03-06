const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./users.models");
const Card = require("../cards/cards.models");

const signup = async (req, res) => {
    try {
        const stored = await User.find({
            email: req.body.email,
            card_id: req.body.card_id
        });
        if (stored.length > 0)
            return res.status(409).json({
                error: "Account creation failed. User exists."
            });
        const valid = await Card.findOne({ card: req.body.card_id });
        console.log("valid", valid);
        if (!valid)
            return res.status(400).json({
                error: "Account creation failed. Illegal card ID."
            });
        const user = User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            card_id: req.body.card_id,
            verified: Math.floor(Math.random() * 1000000 + 54),
            timestamp: Date.now()
        });
        await user.save();
        axios({
            method: "POST",
            url: "https://lightmailer.herokuapp.com/mailer",
            data: {
                to: `${req.body.email}`,
                subject: "User Verification",
                text: `
                    Your activation code is: \n
                    ${user.verified}`
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => {
                // console.log(data)
                return res.status(201).json({
                    message: `User Created! An activation code has been sent to ${user.email}!`,
                    id: user._id
                });
            })
            .catch(() => {
                res.status(400).json({
                    mailErr: "Error sending confirmation link!!",
                    id: user._id
                });
            });
    } catch (err) {
        res.status(400).json({
            error: "Sign up failed!"
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ card_id: req.body.card_id });
        if (user.verified === "true") {
            const ok = await bcrypt.compare(req.body.password, user.password);
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
                );
                return res.status(200).json({
                    token: tok,
                    id: user._id
                });
            }
            return res.status(400).json({
                error: "User verification failed!"
            });
        }
        return res.status(400).json({
            error: "Not verified!"
        });
    } catch (err) {
        return res.status(400).json({
            error: "Error logging in!!!"
        });
    }
};

const findByID = async (req, res) => {
    try {
        const user = await User.findById(
            req.userData.userId,
            "name email type card_id favourites timestamp"
        );
        return res.status(200).send({
            result: user
        });
    } catch (err) {
        return res.status(500).json({
            error: "Illegal parameters!!"
        });
    }
};

const findByName = async (req, res) => {
    try {
        const user = await User.findOne(
            { name: req.params.userName },
            "email name"
        );
        return res.status(201).json({
            result: user
        });
    } catch (err) {
        return res.status(400).json({
            error: "Illegal parameters!!"
        });
    }
};

const update = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userData.userId, req.body, {
            new: true
        });
        return res.status(200).json({
            result: "Profile updated successfully."
        });
    } catch (err) {
        return res.status(500).json({
            error: "Error occured!!"
        });
    }
};

const del = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.userData.userId });
        return res.status(200).json({
            result: "User deleted"
        });
    } catch (err) {
        return res.status(400).json({
            error: "Illegal action!!"
        });
    }
};

const reSendCode = async (req, res) => {
    try {
        const user = await User.findOne(
            { _id: req.params.id },
            "verified email"
        );
        if (user.verified !== "true")
            axios({
                method: "POST",
                url: "https://lightmailer.herokuapp.com/mailer",
                data: {
                    to: `${user.email}`,
                    subject: "User Verification",
                    text: `
                    Your activation code is: \n
                    ${user.verified}`
                },
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(() => {
                    return res.status(201).json({
                        result: `Confirmation link resent!`
                    });
                })
                .catch(err => {
                    return res.status(400).json({
                        mailErr: `Error sending confirmation link!!`
                    });
                });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const sendActivationCode = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, "email");
        if (user !== null) {
            const code = Math.floor(Math.random() * 1000000 + 54);
            axios({
                method: "POST",
                url: "https://lightmailer.herokuapp.com/mailer",
                data: {
                    to: `${user.email}`,
                    subject: "User Verification",
                    text: `
                    Your activation code is: \n
                    ${code}`
                },
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(async () => {
                    await User.updateOne(
                        { email: req.params.email },
                        { code: code }
                    );
                    return res.status(201).json({
                        message: `Confirmation code has been sent!`
                    });
                })
                .catch(err => {
                    return res.status(400).json({
                        error: `Error sending confirmation code!!`
                    });
                });
        }
    } catch (e) {
        return res.status(400).json({
            error: `Error sending confirmation code!!`
        });
    }
};

const verifyCode = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, "code");
        if (user && user.code === req.params.code) {
            return res.status(200).json({
                result: true
            });
        }
        return res.status(400).json({
            result: false
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }, "code");
        if (user && user.code === req.body.code && req.body.password) {
            await User.updateOne(
                { email: req.body.email },
                {
                    password: await bcrypt.hash(req.body.password, 10)
                }
            );
            return res.status(200).json({
                message: "Password changed!"
            });
        }
        return res.status(400).json({
            error: "Error ocurred!"
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const verify = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }, "verified");
        if (req.params.code === user.verified) {
            user.verified = "true";
            user.save();
            return res.status(200).json({
                result: "User verified!"
            });
        }
        return res.staus(400).json({
            error: "User verification failed!"
        });
    } catch (e) {
        return res.status(400).json({
            error: "User verification failed!"
        });
    }
};

const verifyCard = async (req, res) => {
    try {
        const card = await Card.findOne({ card: req.params.id }, "card user");
        if (card)
            return res.status(200).json({
                message: "Valid ID",
                card: card
            });
        return res.status(400).json({
            error: "Card doesn't exist!"
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error ocurred!"
        });
    }
};

const updateFavourites = async (req, res) => {
    try {
        const user = await User.findOne(
            { _id: req.userData.userId },
            "favourites"
        );
        if (!user.favourites.includes(req.body.id))
            user.favourites.push(req.body.id);

        await user.save();
        return res.status(200).json({
            message: "Favourites updated!"
        });
    } catch (e) {
        return res.status(400).json({
            error: "Error occured!"
        });
    }
};

const deleteFavourites = async (req, res) => {
    try {
        const user = await User.findOne(
            { _id: req.userData.userId },
            "favourites"
        );
        const index = user.favourites.indexOf(req.params.id);
        if (index > -1) user.favourites.splice(index, 1);
        await user.save();
        return res.status(200).json({
            result: "Favourites updated!"
        });
    } catch (e) {
        return res.status(400).json({
            result: "Error occured!"
        });
    }
};

module.exports = {
    signup,
    login,
    findByID,
    findByName,
    update,
    verify,
    verifyCard,
    reSendCode,
    updateFavourites,
    deleteFavourites,
    delete: del,
    sendActivationCode,
    verifyCode,
    changePassword
};

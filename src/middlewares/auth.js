const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        jwt.verify(
            req.get("x-access-token"),
            // eslint-disable-next-line no-undef
            process.env.LFS_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(401).json({
                        error: "Token Invalid!"
                    })
                req.userData = decoded
                next()
            }
        )
    } catch (err) {
        return res.status(401).json({
            error: "Auth failed"
        })
    }
}

const admin = async (req, res, next) => {
    try {
        if (req.get("x-access-token") === process.env.LFS_ADMIN)
            req.admin = true
        next()
    } catch (err) {
        return res.status(401).json({
            error: "Auth failed"
        })
    }
}

module.exports = { admin, auth }

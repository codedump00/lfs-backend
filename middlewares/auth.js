const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    try {
        const decoded = jwt.verify(
            req.get("x-access-token"),
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET
        )
        req.userData = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}

module.exports = auth 
const jwt = require("jsonwebtoken")

const user = (req, res, next) => {
    try {
        const decoded = jwt.verify(
            req.get("x-access-token"),
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

module.exports = { user }
const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        jwt.verify(
            req.get("x-access-token"),
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET,
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

module.exports = auth

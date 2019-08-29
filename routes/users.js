const express = require("express")

const auth = require("../middlewares/auth")
const user = require("../controllers/users")

const router = express.Router()

/* POST methods */
router.post("/signup/", user.signup)
router.post("/login/", user.login)

module.exports = router
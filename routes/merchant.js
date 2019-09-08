const express = require("express")

// const auth = require("../middlewares/auth")
const merchant = require("../controllers/merchants")

const router = express.Router()

/* POST methods */
router.post("/register/", merchant.register)
router.post("/login/", merchant.login)

module.exports = router

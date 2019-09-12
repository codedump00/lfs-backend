const express = require("express")

const auth = require("../../middlewares/auth")
const user = require("./users.controllers")

const router = express.Router()

/* POST methods */
router.post("/verify/:token", user.verify)
router.post("/signup/", user.signup)
router.post("/login/", user.login)

router.get("/", auth, user.findByID)
router.get("/name/:name", auth, user.findByName)

router.put("/", auth, user.update)

router.delete("/", auth, user.delete)

module.exports = router

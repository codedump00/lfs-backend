const express = require("express")

const auth = require("../../middlewares/auth")
const user = require("./users.controllers")

const router = express.Router()

/* POST methods */
router.post("/signup/", user.signup)
router.post("/login/", user.login)

router.get("/card/verify/:id", user.verifyCard)
router.get("/resend/activation/:id", user.reSendCode)
router.get("/verify/:id/by/:code", user.verify)
router.get("/", auth, user.findByID)
router.get("/name/:name", auth, user.findByName)

router.put("/", auth, user.update)
router.put("/update/favourites", auth, user.updateFavourites)

router.delete("/", auth, user.delete)
router.delete("/remove/favourites", auth, user.deleteFavourites)

module.exports = router

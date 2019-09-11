const express = require("express")

const auth = require("../../middlewares/auth")
const card = require("./cards.controllers")

const router = express.Router()

/* POST methods */
router.post("/register/", card.register)

router.get("/", auth, card.find)

// router.put("/", auth, card.update)

router.delete("/", auth, card.delete)

module.exports = router

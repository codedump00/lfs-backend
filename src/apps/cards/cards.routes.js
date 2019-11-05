const express = require("express")

const { auth } = require("../../middlewares/auth")
const card = require("./cards.controllers")

const router = express.Router()

/* POST methods */
router.post("/register/", card.register)

router.get("/:card", card.find)

router.delete("/:id", auth, card.delete)

module.exports = router

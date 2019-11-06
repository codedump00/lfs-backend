const express = require("express")

const { admin } = require("../../middlewares/auth")
const card = require("./cards.controllers")

const router = express.Router()

/* POST methods */
router.post("/register/", card.register)

router.get("/:card", card.find)

router.delete("/", admin, card.get)

router.delete("/:id", admin, card.delete)

module.exports = router

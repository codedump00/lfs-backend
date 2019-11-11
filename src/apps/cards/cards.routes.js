const express = require("express");

const { admin } = require("../../middlewares/auth");
const card = require("./cards.controllers");

const router = express.Router();

/* POST methods */
router.post("/register", admin, card.register);

router.get("/:card", card.find);

router.get("/all/:page", admin, card.get);

router.put("/:id", admin, card.update);

router.delete("/:id", admin, card.delete);

module.exports = router;

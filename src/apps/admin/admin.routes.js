const express = require("express")

const admin = require("./admin.controllers")
const router = express.Router()

/* POST methods */
router.get("/:token", admin.verify)

module.exports = router

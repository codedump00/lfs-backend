const express = require("express")

const auth = require("../../middlewares/auth")
const bookmarks = require("./bookmarks.controllers")

const router = express.Router()

/* POST methods */
router.post("/register/", bookmarks.register)

/* GET methods */
router.get("/", auth, bookmarks.find)

/* PUT methods */
router.put("/", auth, bookmarks.update)

/* DELETE methods */
router.delete("/", auth, bookmarks.delete)

module.exports = router

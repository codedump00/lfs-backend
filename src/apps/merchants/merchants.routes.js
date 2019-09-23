const express = require("express")

const auth = require("../../middlewares/auth")
const merchant = require("./merchants.controllers")
const upload = require("../../middlewares/multer")

const router = express.Router()

/* POST methods */
router.post("/signup/", merchant.signup)
router.post("/login/", merchant.login)
router.post("/image/", auth, upload, merchant.upload)

router.get("/", merchant.get)
router.get("/id", auth, merchant.findByID)

router.put("/", auth, merchant.update)

router.delete("/", auth, merchant.delete)

module.exports = router

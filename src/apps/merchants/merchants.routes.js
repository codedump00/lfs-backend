const express = require("express")

const { admin } = require("../../middlewares/auth")
const merchant = require("./merchants.controllers")
const upload = require("../../middlewares/multer")

const router = express.Router()

/* POST methods */
router.post("/create/", merchant.create)
router.post("/image/:id", admin, upload, merchant.upload)

router.get("/", merchant.get)
router.get("/id", merchant.findByID)
router.get("/category", merchant.category)

router.put("/:id", admin, merchant.update)

router.delete("/:id", admin, merchant.delete)

module.exports = router

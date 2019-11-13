const express = require("express");

const { admin } = require("../../middlewares/auth");
const merchant = require("./merchants.controllers");
const upload = require("../../middlewares/multer");

const router = express.Router();

/* POST methods */
router.post("/create/", admin, merchant.create);
router.post("/image/:id", admin, upload, merchant.upload);

router.get("/:page", merchant.get);
router.get("/id/:id", merchant.findByID);
router.get("/category/:page", merchant.category);

router.put("/:id", admin, merchant.update);
router.put("/image/:id", admin, upload, merchant.updateImages);

router.delete("/:id", admin, merchant.delete);
router.delete("/image/:id", admin, merchant.deleteImages);

module.exports = router;

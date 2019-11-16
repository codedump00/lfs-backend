const express = require("express");

const visits = require("./visits.controllers");

const router = express.Router();

/* POST methods */
router.post("/", visits.create);

router.get("/:user/:merchant", visits.get);
router.get("/search/:card", visits.searchUserInfo);

router.put("/", visits.update);

router.delete("/", visits.delete);

module.exports = router;

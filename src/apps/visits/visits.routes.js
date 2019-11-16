const express = require("express");

const visits = require("./visits.controllers");

const router = express.Router();

/* POST methods */
router.post("/", visits.create);

router.get("/search/:card", visits.searchUserInfo);
router.get("/user/:user/:merchant", visits.get);

router.put("/", visits.update);

router.delete("/", visits.delete);

module.exports = router;

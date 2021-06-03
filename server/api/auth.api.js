var express = require("express");
var router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/login", authController.loginWithEmail);
router.get("/hi", authController.hi);
router.get("/testDB", authController.testDB);

module.exports = router;

var express = require("express");
var router = express.Router();
const passport = require("passport");

const authController = require("../controllers/auth.controller");

router.post("/login", authController.loginWithEmail);
router.get("/hi", authController.hi);
router.get("/testDB", authController.testDB);

router.post(
    '/login/google',
    passport.authenticate('google-token', { session: false }),
    authController.loginWithFacebookOrGoogle
);

router.post(
    '/login/facebook',
    passport.authenticate('facebook-token', { session: false }),
    authController.loginWithFacebookOrGoogle
);

module.exports = router;

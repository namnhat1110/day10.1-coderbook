var express = require("express");
var router = express.Router();

const authMiddleware = require("../middlewares/authentication");
const postsController = require("../controllers/posts.controller");

router.post("/", authMiddleware.loginRequired, postsController.create);
router.post("/:id/comments", authMiddleware.loginRequired, postsController.createComment);
router.get(
    '/:email',
    authMiddleware.loginRequired,
    postsController.getUserPosts
);
router.get("/", postsController.getHomePagePosts);
router.get("/:id", postsController.read);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.destroy);

module.exports = router;

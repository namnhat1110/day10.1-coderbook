var express = require("express");
var router = express.Router();

const authMiddleware = require("../middlewares/authentication");
const postsController = require("../controllers/posts.controller");
const commentsController = require('../controllers/comments.controller');
const reactionController = require('../controllers/reaction.controller');


// --- HOMEPAGE --- //
// POSTS

router.post("/", authMiddleware.loginRequired, postsController.create);
router.get("/", postsController.getHomePagePosts);
router.get("/:id", postsController.read);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.destroy);



// COMMENTS

router.post("/:id/comments",
    authMiddleware.loginRequired,
    postsController.createComment);
router.delete(
    '/:postId/comments/:commentId',
    authMiddleware.loginRequired,
    commentsController.destroy
);
router.patch(
    '/:postId/comments/:commentId',
    authMiddleware.loginRequired,
    commentsController.update
);


// REACTIONS

router.post(
    '/:id/reactions',
    authMiddleware.loginRequired,
    reactionController.create
);
router.delete(
    '/:id/reactions/:reactionId',
    authMiddleware.loginRequired,
    reactionController.destroy
);
router.patch(
    '/:id/reactions/:reactionId',
    authMiddleware.loginRequired,
    reactionController.update
);



router.get(
    '/:email',
    authMiddleware.loginRequired,
    postsController.getUserPosts
);

module.exports = router;

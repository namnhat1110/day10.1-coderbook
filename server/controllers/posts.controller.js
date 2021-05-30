const Post = require("../models/Post");
const Comment = require("../models/Comment");

const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const { post } = require("../api/posts.api");

const postController = {};

postController.create = catchAsync(async (req, res) => {
  const post = await Post.create({ owner: req.userId, ...req.body });
  res.json(post);
});

postController.read = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post)
    return next(new AppError(404, "Post not found", "Get Single Post Error"));

  await post.populate("owner").populate("comments");
  await post.execPopulate();

  res.json(post);
});

postController.update = catchAsync(async (req, res) => {
  await Post.findByIdAndUpdate(
    { _id: req.params.id },
    { email: req.body.email },
    { new: true },
    (err, post) => {
      console.log({ err, post });
      if (!post) {
        res.status(404).json({ message: "Post not Found" });
      } else {
        res.json(post);
      }
    }
  );
});

postController.destroy = catchAsync(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id, (err, post) => {
    if (!post) {
      res.status(404).json({ message: "Post not Found" });
    } else {
      res.json(post);
    }
  });
});

postController.getHomePagePosts = catchAsync(async (req, res) => {
  const posts = await Post.find({}).sort({ _id: -1 })
    .populate('owner')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'owner',
      },
    })
    .populate({
      path: 'reactions',
      populate: {
        path: 'owner',
      },
    })
  return sendResponse(
    res,
    200,
    true,
    { posts },
    null,
    "Get homepage posts successful"
  );
});

postController.getUserPosts = catchAsync(async (req, res) => {

  const posts = await Post.find({ owner: req.userId })
    .populate('owner')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'owner',
      },
    })

  return sendResponse(res, 200, true, { posts }, null, 'Received posts');
});


postController.createComment = catchAsync(async (req, res) => {
  const comment = await Comment.create({ owner: req.userId, ...req.body, post: req.params.id })
  const post = await Post.findById(req.params.id)
  await post.comments.unshift(comment._id)
  await post.save()
  await post.populate({
    path: 'comments', populate: {
      path: 'owner',
    }
  }).execPopulate()

  return sendResponse(
    res,
    200,
    true,
    { post },
    null,
    "Create comment successful"
  );
});

module.exports = postController;

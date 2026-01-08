const express = require("express");
const {
  getPosts,
  getPost,
  getPostsByUser,
  createPost,
  createPosture,
  repostPost,
  unrepostPost,
  likePost,
} = require("../controller/postController");

const postRouter = express.Router();
const auth = require("../middleware/auth");

// Get posts by user
postRouter.get("/user/:userId", getPostsByUser);

// Get post by id
postRouter.get("/:id", getPost);

// Get all posts
postRouter.get("/", getPosts);

// Create post (requires auth)
postRouter.post("/", auth, createPost);

// Create picture post
postRouter.post("/picture", auth, createPosture);

// create like route here in the future
postRouter.post("/:id/like", auth, likePost);

// repost routes
postRouter.post("/:id/repost", auth, repostPost);
postRouter.delete("/:id/repost", auth, unrepostPost);

module.exports = postRouter;

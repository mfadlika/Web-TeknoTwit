const express = require("express");
const {
  getPosts,
  getPost,
  getPostsByUser,
  createPost,
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

module.exports = postRouter;

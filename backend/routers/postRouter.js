const express = require("express");
const { getPosts } = require("../controller/postController");

const postRouter = express.Router();

postRouter.get("/", getPosts);

// get post by id
// postRouter.get("/:id", getPost);

// get posts by user id
// postRouter.get("/user/:userId", getPostsByUser);

// create a new post
// postRouter.post("/", createPost);

module.exports = postRouter;

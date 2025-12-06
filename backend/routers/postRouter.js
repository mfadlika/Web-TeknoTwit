const express = require("express");
const { getPosts } = require("../controller/postController");

const postRouter = express.Router();

postRouter.get("/", getPosts);

module.exports = postRouter;

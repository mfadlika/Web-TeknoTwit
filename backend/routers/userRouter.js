const express = require("express");
const { getUsers } = require("../controller/userController");

const userRouter = express.Router();

userRouter.get("/", getUsers);

// get user by id
// userRouter.get("/:id", getUser);

// get user by username
// userRouter.get("/username/:username", getUserByUsername);

module.exports = userRouter;

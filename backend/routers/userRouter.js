const express = require("express");
const { getUsers } = require("../controller/userController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userRouter = express.Router();

userRouter.get("/", getUsers);

// GET all users
exports.getUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// get user by id
// userRouter.get("/:id", getUser);

// get user by username
// userRouter.get("/username/:username", getUserByUsername);

module.exports = userRouter;

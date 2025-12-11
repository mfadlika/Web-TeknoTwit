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

// GET user by id
exports.getUser = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
  
      const user = await prisma.user.findUnique({
        where: { id },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// userRouter.get("/:id", getUser);
userRouter.get("/:id", getUserById);


// get user by username

// userRouter.get("/username/:username", getUserByUsername);

module.exports = userRouter;

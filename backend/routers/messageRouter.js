const express = require("express");
const auth = require("../middleware/auth");
const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require("../controller/messageController");

const messageRouter = express.Router();

messageRouter.post("/", auth, sendMessage);
messageRouter.get("/", auth, getMessages);
messageRouter.delete("/:id", auth, deleteMessage);

module.exports = messageRouter;
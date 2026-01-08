const express = require("express");
const {
  createShare,
  getSharesByPost,
} = require("../controller/shareController");
const auth = require("../middleware/auth");

const shareRouter = express.Router();
const express = require("express");
const auth = require("../middleware/auth");
const {
  sendDirectMessage,
  getDirectMessages,
} = require("../controller/shareController");

shareRouter.post("/dm", auth, sendDirectMessage);
shareRouter.get("/dm", auth, getDirectMessages);

module.exports = shareRouter;

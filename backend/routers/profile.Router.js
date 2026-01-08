const express = require("express");
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  followProfile,
  unfollowProfile,
} = require("../controller/profileController");

const profileRouter = express.Router();

profileRouter.get("/", auth, getProfile);
profileRouter.put("/", auth, updateProfile);
profileRouter.delete("/", auth, deleteProfile);
profileRouter.post("/follow/:userId", auth, followProfile);
profileRouter.post("/unfollow/:userId", auth, unfollowProfile);

module.exports = profileRouter;
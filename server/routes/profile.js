
const express = require("express");
const User = require("../models/Users");
const { ObjectId } = require("mongodb");
const { isAuthenticated } = require("../utils/tokens");
const Router = express.Router();

Router.post("/update", isAuthenticated, async (req, res) => {
  let UpdateProfile = req.body;

  try {
    const user = await User.findById(UpdateProfile.userId);
    if (user) {
      const userId = user._id.toString();
      const updateDoc = {
        $set: { profileUrl: UpdateProfile.profile, bio: UpdateProfile.bio },
      };

      const updateResult = await User.updateOne(
        {
          _id: new ObjectId(userId),
        },
        updateDoc
      );
      return res
        .status(200)
        .json({ ok: true, message: "User details updated successfully!" });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = Router;
const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users");
const passport = require("passport");

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  usersController.getMe
);

router.patch(
  "/me",
  passport.authenticate("jwt", { session: false }),
  usersController.updateMe
);

router.patch(
  "/me/change-password",
  passport.authenticate("jwt", { session: false }),
  usersController.changePasswordMe
);

module.exports = router;

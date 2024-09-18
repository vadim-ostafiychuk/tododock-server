const _ = require("lodash");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  getMe: (req, res) => {
    const user = req.user;

    const protectedUser = _.omit(user.toObject(), ["hashedPassword"]);

    return res.json({
      user: protectedUser,
    });
  },
  updateMe: async (req, res, next) => {
    try {
      const user = req.user;

      const { firstName, lastName, email } = req.body;

      if (email && email !== user.email) {
        const foundUser = await User.findOne({
          _id: {
            $ne: user._id,
          },
          email: email,
        });

        if (foundUser) {
          return res.status(403).json({ code: "EMAIL_EXISTS" });
        }
      }

      await User.updateOne({ _id: user._id }, { firstName, lastName, email });

      return res.json({
        updated: true,
      });
    } catch (err) {
      return next(err);
    }
  },
  changePasswordMe: async (req, res, next) => {
    try {
      const user = req.user;
      const { oldPassword, newPassword } = req.body;

      const isValidPassword = await bcrypt.compare(
        oldPassword,
        user.hashedPassword
      );

      if (!isValidPassword) {
        return res.status(403).json({ code: "INVALID_OLD_PASSWORD" });
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.updateOne({ _id: user._id }, { hashedPassword });

      return res.status(200).json({
        changed: true,
      });
    } catch (err) {
      return next(err);
    }
  },
};

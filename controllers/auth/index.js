require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/server");
const _ = require("lodash");

const { loginDtoSchema, registerDtoSchema } = require("./schema");
const User = require("../../models/user");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const validate = loginDtoSchema.validate({ email, password });

      if (validate.error) {
        return res.status(400).json({ message: validate.error.message });
      }

      const user = await User.findOne({
        email,
      }).exec();

      if (!user) {
        return res.status(403).json({ code: "USER_NOT_LOGINED" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.hashedPassword
      );

      if (!isValidPassword) {
        return res.status(403).json({ code: "USER_NOT_LOGINED" });
      }

      const protectedUser = _.omit(user.toObject(), ["hashedPassword"]);

      return res.json({
        user: protectedUser,
        accessToken: jwt.sign(
          {
            userId: user._id,
          },
          config.JWT_PRIVATE_KEY,
          { expiresIn: "1d" }
        ),
      });
    } catch (err) {
      return next(err);
    }
  },
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const validate = registerDtoSchema.validate({
        firstName,
        lastName,
        email,
        password,
      });

      if (validate.error) {
        return res.status(400).json({ message: validate.error.message });
      }

      const foundUser = await User.findOne({
        email,
      });

      if (foundUser) {
        return res.status(400).json({ code: "USER_EXISTS" });
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email,
        hashedPassword,
        firstName,
        lastName,
      });

      await user.save();

      const protectedUser = _.omit(user.toObject(), ["hashedPassword"]);

      return res.json({
        user: protectedUser,
        accessToken: jwt.sign(
          {
            userId: user._id,
          },
          config.JWT_PRIVATE_KEY,
          { expiresIn: "1d" }
        ),
      });
    } catch (err) {
      return next(err);
    }
  },
};

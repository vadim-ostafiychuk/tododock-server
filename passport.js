const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("./config/server");
const User = require("./models/user");

module.exports = {
  init: () => {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.JWT_PRIVATE_KEY,
        },
        async (jwtPayload, done) => {
          try {
            const user = await User.findById(jwtPayload.userId).exec();

            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  },
};

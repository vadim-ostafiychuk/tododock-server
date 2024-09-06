require("dotenv").config();

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  MONGODB_URL: process.env.MONGODB_URL,
};

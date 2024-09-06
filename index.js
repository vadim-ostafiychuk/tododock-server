const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config/server");

const indexRouter = require("./routes/index");
const passport = require("./passport");

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(express.static("public"));

passport.init();

app.use("/api", indexRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = +config.port || 3000;

mongoose
  .connect(config.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB connection error: ", err));

mongoose.set("debug", config.nodeEnv === "development");

app.listen(port, () => {
  console.log("Server started on", port);
});

module.exports = app;

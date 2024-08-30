require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const indexRouter = require("./routes/index");

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api", indexRouter);

const port = +process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB connection error: ", err));

mongoose.set("debug", process.env.NODE_ENV === "development");

app.listen(port, () => {
  console.log("Server started on", port);
});

module.exports = app;

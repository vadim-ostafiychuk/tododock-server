require("dotenv").config();

const Status = require("./models/status");
const mongoose = require("mongoose");

const statuses = [
  new Status({
    title: "Open",
    color: "#9c9c9c",
  }),
  new Status({
    title: "Closed",
    color: "#e80000",
  }),
  new Status({
    title: "Done",
    color: "#00fa11",
  }),
];

//connect mongoose
mongoose
  .connect(process.env.MONGODB_URL)
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");

    Promise.all(
      statuses.map(async (p, index) => {
        return p.save();
      })
    ).then(() => {
      console.log("DONE!");
      mongoose.disconnect();
    });
  });

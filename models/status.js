const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StatusSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Status = mongoose.model("Status", StatusSchema);

module.exports = Status;

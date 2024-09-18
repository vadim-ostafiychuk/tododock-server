const { required } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: Schema.Types.ObjectId, ref: "Status", required: true },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;

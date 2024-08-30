const express = require("express");
const router = express.Router();
const todosRouter = require("./todos/index");

router.use("/todos", todosRouter);

router.get("/", (req, res, next) => {
  res.send("Hello world!");
});

module.exports = router;

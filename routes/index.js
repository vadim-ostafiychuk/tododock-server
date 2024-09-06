const express = require("express");
const router = express.Router();
const todosRouter = require("./todos/index");
const authRouter = require("./auth/index");

router.use("/todos", todosRouter);
router.use("/auth", authRouter);

router.get("/", (req, res, next) => {
  res.send("Hello world!");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const todosRouter = require("./todos/index");
const authRouter = require("./auth/index");
const usersRouter = require("./users/index");
const statusesRouter = require("./statuses/index");

router.use("/todos", todosRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/statuses", statusesRouter);

router.get("/", (req, res, next) => {
  res.send("Hello world!");
});

module.exports = router;

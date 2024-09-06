const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    let { limit = 0, page = 1 } = req.query;

    let pageCount = 0;

    limit = +limit;
    page = +page;

    const offset = (page - 1) * limit;

    const query = Todo.find({}, null, {
      ...(limit && { limit }),
      ...(limit && { skip: offset }),
    });

    const todos = await query.exec();

    const count = await Todo.countDocuments({}, null, {});

    if (count) {
      if (!limit) {
        pageCount = 1;
      } else {
        pageCount = Math.ceil(count / limit);
      }
    }

    res.json({
      data: todos,
      meta: {
        count,
        pageCount: pageCount,
        page: page,
        limit: limit,
      },
    });
  }
);

router.get(
  "/my",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    let { limit = 0, page = 1 } = req.query;

    let pageCount = 0;

    limit = +limit;
    page = +page;

    const offset = (page - 1) * limit;

    const query = Todo.find({}, null, {
      ...(limit && { limit }),
      ...(limit && { skip: offset }),
    });

    const todos = await query.exec();

    const count = await Todo.countDocuments({}, null, {});

    if (count) {
      if (!limit) {
        pageCount = 1;
      } else {
        pageCount = Math.ceil(count / limit);
      }
    }

    res.json({
      data: todos,
      meta: {
        count,
        pageCount: pageCount,
        page: page,
        limit: limit,
      },
    });
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const { id } = req.params;

    const todo = await Todo.findOne({
      _id: id,
    }).exec();

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found!",
      });
    }

    return res.json({
      data: todo,
    });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required!" });
    }

    const todo = await Todo.create({ title, description: description || "" });

    return res.json({
      data: todo,
    });
  }
);

module.exports = router;

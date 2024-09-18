const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");
const passport = require("passport");
const { isValidObjectId } = require("mongoose");

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
    const user = req.user;

    let { limit = 0, page = 1 } = req.query;

    let pageCount = 0;

    limit = +limit;
    page = +page;

    const offset = (page - 1) * limit;

    const query = Todo.find(
      {
        author: user._id,
      },
      null,
      {
        ...(limit && { limit }),
        ...(limit && { skip: offset }),
      }
    );

    const todos = await query.populate("status").exec();

    const count = await Todo.countDocuments(
      {
        author: user._id,
      },
      null,
      {}
    );

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
    const user = req.user;

    const todo = await Todo.findOne({
      _id: id,
      author: user._id,
    })
      .populate("status")
      .exec();

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
    const { title, description, status } = req.body;

    const user = req.user;

    if (!title) {
      return res.status(400).json({ message: "Title is required!" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required!" });
    }

    const todo = await Todo.create({
      title,
      description: description || "",
      author: user._id,
      status: status,
    });

    return res.json({
      data: todo,
    });
  }
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      const user = req.user;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Id" });
      }

      const todo = await Todo.findOne({
        _id: id,
        author: user._id,
      }).exec();

      if (!todo) {
        return res.status(404).json({
          message: "Todo not found!",
        });
      }

      todo.title = title;
      todo.description = description;
      todo.status = status;

      await todo.save();

      return res.status(200).json({
        updated: true,
        data: todo,
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Id" });
      }

      const todo = await Todo.findOne({
        _id: id,
        author: user._id,
      }).exec();

      if (!todo) {
        return res.status(404).json({
          message: "Todo not found!",
        });
      }

      await Todo.deleteOne({ _id: todo.id });

      return res.json({
        deleted: true,
      });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;

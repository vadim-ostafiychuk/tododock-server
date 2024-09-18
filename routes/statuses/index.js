const express = require("express");
const router = express.Router();
const Status = require("../../models/status");

router.get("/", async (req, res) => {
  const statuses = await Status.find({}, null, {}).exec();

  return res.json({
    data: statuses,
  });
});

module.exports = router;

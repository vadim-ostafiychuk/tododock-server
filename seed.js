require("dotenv").config();

const mongoose = require("mongoose");

async function main() {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .catch((err) => {
      console.log(err.stack);
      process.exit(1);
    })
    .then(async () => {
      const Status = require("./models/status");
      require("./models/todo");

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

      console.log("connected to db in development environment");

      const statusesFromDB = await Status.find();

      if (statusesFromDB.length === 0) {
        await Promise.all(
          statuses.map(async (p, index) => {
            return p.save();
          })
        ).then(() => {
          console.log("DONE!");
        });
      }

      await mongoose.disconnect();
    });
}

main();

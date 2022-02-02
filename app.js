const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const csvRouter = require("./routes/csv.js");
const userRouter = require("./routes/user.js");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const dbUrl = process.env.dbUrl || "mongodb://127.0.0.1:27017/kalpas";
mongoose
  .connect(dbUrl, {})
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.use("/", csvRouter);
app.use("/", userRouter);

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

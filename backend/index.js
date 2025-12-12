const express = require("express");
require("dotenv").config();
const userRouter = require("./routers/userRouter.js");
const cors = require("cors");
const postRouter = require("./routers/postRouter.js");

const app = express();


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

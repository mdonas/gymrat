const express = require("express");
const morgan = require("morgan");
const taskRouter = require("./routes/task.routes");
const cors = require("cors");

const app = express();
// app.use(cors);
app.use(morgan("dev"));
app.use(express.json());

app.use(taskRouter);
//Express Middleware de Error
app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

app.listen(4000);

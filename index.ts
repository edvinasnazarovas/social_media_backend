require("dotenv").config()
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;

const auth_router = require("./routes/auth");
const post_router = require("./routes/post");

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json()); // <-- Add this line

// Your routes
app.use("/", auth_router);
app.use("/", post_router);

app.listen(port, () => {
  console.log("Listening on port ", port);
});

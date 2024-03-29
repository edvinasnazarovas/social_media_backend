require("dotenv").config()
var express = require("express");
const path = require('path');
var app = express();
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;
var cors = require("cors");

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

const auth_router = require("./routes/auth");
const post_router = require("./routes/post");
const user_router = require("./routes/users");

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// Your routes
app.use("/", auth_router);
app.use("/", post_router);
app.use("/", user_router);

app.listen(port, () => {
  console.log("Listening on port ", port);
});
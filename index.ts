require("dotenv").config()
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 3000;
import { db } from "./db"

app.use(cookieParser());

app.listen(port);

console.log("Listening on port ", port);
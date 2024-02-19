"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var mysql = require('mysql');
var util = require("util");
exports.db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
exports.db.query = util.promisify(exports.db.query);
exports.db.connect(function (err) {
    if (err)
        throw err;
    console.log('Connected!');
});

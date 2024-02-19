const sqlite3 = require('sqlite3');
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const mysql = require('mysql');
const util = require("util");

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.query = util.promisify(db.query);

db.connect(function (err: any) {
    if (err) throw err;
    console.log('Connected!');
});

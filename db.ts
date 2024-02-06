const sqlite3 = require('sqlite3');
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const mysql = require('mysql');

mkdirp.sync('./var/db');

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(function (err: any) {
    if (err) throw err;
    console.log('Connected!');
});

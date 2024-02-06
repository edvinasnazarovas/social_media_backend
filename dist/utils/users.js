"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = exports.getCurrentUser = exports.findUserByUsername = exports.createUser = void 0;
var db_1 = require("../db");
var jwt = require('jsonwebtoken');
function createUser(user) {
    return new Promise(function (resolve, reject) {
        try {
            var sql = "INSERT INTO user (username, password, email, name, last_name, group_id) VALUES (?, ?, ?, ?, ?, ?)";
            var values = [user.username, user.password, user.email, user.name, user.last_name, user.group_id];
            db_1.db.query(sql, values, function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        }
        catch (error) {
            console.error("Error while creating user ", error);
        }
    });
}
exports.createUser = createUser;
function findUserByUsername(username) {
    return new Promise(function (resolve, reject) {
        try {
            var sql = "SELECT * FROM users WHERE username = ?";
            db_1.db.query(sql, username, function (err, rows) {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.findUserByUsername = findUserByUsername;
function getCurrentUser(token) {
    return new Promise(function (resolve, reject) {
        try {
            console.log("TOKEN ", token);
            if (!token) {
                reject("No token");
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(user);
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
exports.getCurrentUser = getCurrentUser;
function getUserId(username) {
    return new Promise(function (resolve, reject) {
        try {
            var sql = "SELECT id FROM user WHERE username = ?";
            db_1.db.query(sql, username, function (err, rows) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                if (rows) {
                    resolve(rows[0].id);
                }
                else {
                    reject("No user found.");
                }
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
exports.getUserId = getUserId;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = exports.fetchPosts = void 0;
var db_1 = require("../db");
function fetchPosts() {
    return new Promise(function (resolve, reject) {
        try {
            var sql = "SELECT post.*, us.username, media.path FROM post\n            LEFT JOIN user AS us ON us.id = post.user_id\n            LEFT JOIN media ON media.id = post.media_id";
            db_1.db.query(sql, function (err, rows) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(rows);
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
exports.fetchPosts = fetchPosts;
function createPost(post) {
    return new Promise(function (resolve, reject) {
        try {
            var sql = "INSERT INTO post (description, user_id, media_id) VALUES (?, ?, ?)";
            var values = [post.description, post.user_id, post.media_id];
            db_1.db.query(sql, values, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(res);
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
exports.createPost = createPost;

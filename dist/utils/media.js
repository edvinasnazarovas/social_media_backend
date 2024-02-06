"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedia = void 0;
var db_1 = require("../db");
function createMedia(file_path) {
    return new Promise(function (resolve, reject) {
        try {
            var sql = "INSERT INTO media (path, media_type_id) VALUES (?, 1)";
            db_1.db.query(sql, file_path, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(res.insertId);
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
exports.createMedia = createMedia;

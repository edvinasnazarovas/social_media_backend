import { db } from "../db"

function createUser(user) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `INSERT INTO users (username, password, email, name, lastname) VALUES (?, ?, ?, ?, ?)`;
            const values = [user.username, user.password, user.email, user.name, user.lastname];
            db.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        } catch (error) {
            console.error("Error while creating user ", error);
        }
    });
}

function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT * FROM users WHERE username = ?`;
            db.query(sql, username, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows[0]);
            });
        } catch (error) {
            reject(error);
        }
    });

}

module.exports = { createUser, findUserByUsername }
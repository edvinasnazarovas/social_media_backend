import { db } from "../db"
import { User } from "../definitions";
const jwt = require('jsonwebtoken');

export function createUser(user: User) {
    return new Promise((resolve, reject) => {
        try {
            const sql = `INSERT INTO user (username, password, email, name, last_name, group_id) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [user.username, user.password, user.email, user.name, user.last_name, user.group_id];
            db.query(sql, values, (err: Error, res: any) => {
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

export function findUserByUsername(username) {
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

export function getCurrentUser(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
        try {
            console.log("TOKEN ", token);
            if (!token) {
                reject("No token");
            }

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(user);
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

export function getUserId(username: string): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const sql = "SELECT id FROM user WHERE username = ?";
            db.query(sql, username, (err: any, rows: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                if (rows) {
                    resolve(rows[0].id);
                } else {
                    reject("No user found.");
                }
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
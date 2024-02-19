import { db } from "../db"
import { User } from "../definitions";
const jwt = require('jsonwebtoken');
import { promises as fsPromises } from 'fs';

export async function createUser(user: User) {
    try {
        const sql = `INSERT INTO user (username, password, email, name, last_name, group_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [user.username, user.password, user.email, user.name, user.last_name, user.group_id];
        const res = await db.query(sql, values);
        return res;
    } catch (error) {
        console.error("Error while creating user ", error);
    }
}

export async function findUserByUsername(username) {
    try {
        const sql = `SELECT * FROM users WHERE username = ?`;
        const rows = await db.query(sql, username);
        return rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCurrentUser(token: string): Promise<User> {
    try {
        console.log("TOKEN ", token);
        if (!token) {
            throw new Error("No token.");
        }

        const user: User = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: User) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(user); // Resolve the promise with the user object
            });
        });

        console.log("USER ", user);

        if (user) {
            return user;
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserId(username: string): Promise<number> {
    try {
        const sql = "SELECT id FROM user WHERE username = ?";
        const rows = await db.query(sql, username);
        if (rows) {
            return rows[0].id;
        } else {
            throw new Error("No user found");
        }
    } catch (error) {
        console.error(error);
    }
}

export async function uploadUserIcon(user_id: number, icon_path: string) {
    try {
        const sql = "UPDATE user SET icon_path = ? WHERE id = ?";
        const res = await db.query(sql, [icon_path, user_id]);
        return res;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function fetchUserIconPath(user_id: number): Promise<string> {
    try {
        const sql = "SELECT icon_path FROM user WHERE id = ?";
        const res = await db.query(sql, user_id);
        if (res) {
            return res[0].icon_path;
        }
    } catch (error) {
        return error;
    }
}

export async function deleteFile(file_path: string) {
    try {
        await fsPromises.unlink(file_path);
        console.log(`File ${file_path} was deleted successfully`);
        return true; // Indicate success
    } catch (error) {
        console.error(`Error deleting file ${file_path}:`, error);
        return error; // Return error for further handling if needed
    }
}
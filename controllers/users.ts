import { db } from "../db"
const bcrypt = require("bcryptjs");

function fetchUsers(req: any, res: any, next: any) {
    const sql = `SELECT * FROM user`;
    db.query(sql, (err: any, rows: any) => {
        if (err) {
            return next(err);
        }
        res.locals.users = rows;
        return next();
    });
}

async function editUser(req: any, res: any, next: any) {
    const sql = `UPDATE user SET name = ?, lastname = ?, username = ?, password = ?, email = ? WHERE ID = ?`;
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const values = [req.body.name, req.body.lastname, req.body.username, hashedPassword, req.body.email,
        req.params.id];

        db.query(sql, values, (err, result) => {
            if (err) {
                return next(err); // Pass the error to the error handling middleware
            }
            if (result.affectedRows === 0) {
                // No rows affected, could mean the ID does not exist
                return res.status(404).send("User not found or no changes made.");
            }
            // Successfully updated
            // Consider sending a specific response or calling next() if further processing is required
            return res.status(200).send("User updated successfully.");
        });
    } catch (error) {
        // Handle hashing error or other exceptions
        return next(error);
    }
}

module.exports = { fetchUsers, editUser }
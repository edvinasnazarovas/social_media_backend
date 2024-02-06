import { db } from "../db";
import { Group } from "../definitions";

export async function getGroupNameById(group_id: number): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT name FROM group WHERE id = ?`;
            db.query(sql, group_id, (err: Error, rows: Group[]) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                if (rows) {
                    resolve(rows[0].id)
                } else {
                    throw new Error("Group not found.");
                }
            });
        } catch(error) {
            console.error(error);
            reject(error);
        }
    });
}

export async function getGroupIdByName(group_name: string): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT id FROM \`group\` WHERE name = ?`;
            db.query(sql, group_name, (err: Error, rows: Group[]) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                if (rows) {
                    resolve(rows[0].id);
                } else {
                    reject("Group not found")
                }
            });
        } catch(error) {
            console.error(error);
            reject(error);
        }
    });
}
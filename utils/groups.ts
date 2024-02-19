import { db } from "../db";
import { Group } from "../definitions";

export async function getGroupNameById(group_id: number): Promise<number> {
    try {
        const sql = `SELECT name FROM group WHERE id = ?`;
        const rows = await db.query(sql, group_id);
        if (rows) {
            return rows[0].name;
        } else {
            throw new Error("Group not found.");
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getGroupIdByName(group_name: string): Promise<number> {
    try {
        const sql = `SELECT id FROM \`group\` WHERE name = ?`;
        const rows = await db.query(sql, group_name);
        if (rows) {
            return rows[0].id;

        } else {
            throw new Error("Group not found.")
        }
    } catch (error) {
        console.error(error);
    }
}

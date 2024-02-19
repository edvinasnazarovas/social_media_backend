import { db } from "../db";

export async function createMedia(file_path: string): Promise<number> {
    try {
        const sql = "INSERT INTO media (path, media_type_id) VALUES (?, 1)";
        const res = await db.query(sql, file_path);
        return res.insertId;
    } catch (error) {
        console.error(error);
    }
}
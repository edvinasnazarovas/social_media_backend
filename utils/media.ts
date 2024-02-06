import { db } from "../db";

export function createMedia(file_path: string): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const sql = "INSERT INTO media (path, media_type_id) VALUES (?, 1)";
            db.query(sql, file_path, (err: any, res: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(res.insertId);
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
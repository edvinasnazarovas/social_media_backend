import { db } from "../db";
import { Post } from "../definitions";

export function fetchPosts(): Promise<Post[]> {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT post.*, us.username, media.path FROM post
            LEFT JOIN user AS us ON us.id = post.user_id
            LEFT JOIN media ON media.id = post.media_id`;
            db.query(sql, (err: Error, rows: Post[]) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(rows);
            });
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
}

export function createPost(post: any) {
    return new Promise((resolve, reject) => {
        try {
            const sql = "INSERT INTO post (description, user_id, media_id) VALUES (?, ?, ?)";
            const values = [post.description, post.user_id, post.media_id];
            db.query(sql, values, (err: any, res: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(res);
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
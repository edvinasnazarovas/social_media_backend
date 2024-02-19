import { db } from "../db";
import { Post } from "../definitions";

export async function fetchPosts(): Promise<Post[]> {
    try {
        const sql = `SELECT post.*, us.username, us.icon_path, media.path, COUNT(pl.id) AS likes FROM post
        LEFT JOIN user AS us ON us.id = post.user_id
        LEFT JOIN media ON media.id = post.media_id
        LEFT JOIN post_like AS pl ON pl.post_id = post.id
        GROUP BY 
post.id, post.description, post.user_id, post.media_id`;
        const posts: Post[] = await db.query(sql);
        return posts;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch posts.");
    }
}

export async function fetchPost(post_id: number): Promise<Post> {
    try {
        const sql = "SELECT * FROM post WHERE id = ?";
        const res = await db.query(sql, post_id);
        if (res) {
            return res[0];
        } else {
            throw new Error("Post not found");
        }
    } catch (error) {
        throw new Error(error);
    }
}

export function createPost(post: any) {
    try {
        const sql = "INSERT INTO post (description, user_id, media_id) VALUES (?, ?, ?)";
        const values = [post.description, post.user_id, post.media_id];
        const res = db.query(sql, values);
        return res;
    } catch (error) {
        console.error(error);
    }
}

export async function deletePost(post_id: number): Promise<Response> {
    try {
        const sql = "DELETE FROM post WHERE id = ?";
        const res = await db.query(sql, post_id);
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

export async function likePost(post_id: number, user_id: number) {
    return new Promise((resolve, reject) => {
        try {
            console.log("LIKING")
            console.log("USER ID ", user_id)
            const sql = "INSERT INTO post_like (post_id, user_id) VALUES (?, ?)";
            db.query(sql, [post_id, user_id], (err: any, res: any) => {
                if (err) {
                    console.error("ERROR LIKING ", err);
                }
                console.log("LIKED ", res);
                resolve(res);
            })
        } catch (error) {
            reject(error);
        }
    })
}

export async function unlikePost(post_id: number, user_id: number) {
    try {
        const sql = "DELETE FROM post_like WHERE post_id = ? AND user_id = ?";
        const res = await db.query(sql, [post_id, user_id]);
        return res;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function getIsLikedPost(post_id: number, user_id: number) {
    try {
        const sql = "SELECT * FROM post_like WHERE post_id = ? AND user_id = ?";
        const res = await db.query(sql, [post_id, user_id]);
        if (res.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}
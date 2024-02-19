import { authenticateToken } from "../controllers/auth";
import { Post, User } from "../definitions";
import { createMedia } from "../utils/media";
import { createPost, deletePost, fetchPost, fetchPosts, getIsLikedPost, likePost, unlikePost } from "../utils/posts";
import { getCurrentUser, getUserId } from "../utils/users";
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        // You can use the original name or add a timestamp for uniqueness
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

const express = require("express");
const router = express.Router();

router.get("/api/posts", authenticateToken, async (req: any, res: any) => {
    const posts = await fetchPosts();
    const user = await getCurrentUser(req.cookies.token);
    user.id = await getUserId(user.username);

    await Promise.all(posts.map(async (post) => {
        post.liked = await getIsLikedPost(post.id, user.id);
        return post;
    }));

    console.log("POSTS ", posts);
    return res.status(200).json(posts);
});


router.post("/api/posts/:id/like", authenticateToken, async (req: any, res: any) => {
    try {
        const user = await getCurrentUser(req.cookies.token);
        user.id = await getUserId(user.username);
        const is_liked = await getIsLikedPost(req.params.id, user.id);
        if (is_liked) {
            const unliked = await unlikePost(req.params.id, user.id);
            return res.status(200).send("Unliked.");
        } else {
            const liked = await likePost(req.params.id, user.id);
            return res.status(201).send("Liked.");
        }
        return res.status(200).send("Liked/unliked");
    } catch (error) {
        return res.status(500).send("Server error");
    }
});

router.post("/api/posts", authenticateToken, upload.single('file'), async (req: any, res: any) => {
    if (!(req.body.description && req.file)) {
        return res.status(400).send("Please provide all values.");
    }

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("No token");
    }

    const user: User = await getCurrentUser(token);
    const user_id: number = await getUserId(user.username);

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const fileSize = req.file.size;

    const media_id: number = await createMedia(filePath);

    const post_obj: Post = { id: null, description: req.body.description, user_id, media_id, liked: false, likes: 0 };

    const post = await createPost(post_obj);

    return res.status(200).send(JSON.stringify({ user_id: user_id, filePath, fileName, fileSize }));
});

router.delete("/api/posts/:id", authenticateToken, async (req: any, res: any) => {
    const user: User = await getCurrentUser(req.cookies.token);
    user.id = await getUserId(user.username);

    const post = await fetchPost(req.params.id);

    if (post.user_id === user.id) {
        await deletePost(post.id);
        return res.status(200).send("Post deleted.");
    } else {
        return res.status(401).send("Post does not belong to user.");
    }
});

module.exports = router;
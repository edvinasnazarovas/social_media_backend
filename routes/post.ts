import { authenticateToken } from "../controllers/auth";
import { Post, User } from "../definitions";
import { createMedia } from "../utils/media";
import { createPost, fetchPosts } from "../utils/posts";
import { getCurrentUser, getUserId } from "../utils/users";
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
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
    return res.status(200).json(posts);
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

    const post_obj: Post = {description: req.body.description, user_id, media_id};

    const post = await createPost(post_obj);

    return res.status(200).send(JSON.stringify({ user_id: user_id, filePath, fileName, fileSize }));
});

module.exports = router;
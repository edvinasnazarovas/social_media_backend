import { authenticateToken } from "../controllers/auth";
import { deleteFile, fetchUserIconPath, getCurrentUser, getUserId, uploadUserIcon } from "../utils/users";

const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        // You can use the original name or add a timestamp for uniqueness
        cb(null, Date.now() + '-' + file.originalname)
    },
    fileFilter: (req, file, cb) => {
        // Check the file's mimetype to be an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept file
        } else {
            cb(new Error('Only image files are allowed!'), false); // Reject file
        }
    },
})

const upload = multer({ storage: storage })

router.post("/api/users/icon", authenticateToken, upload.single('file'), async (req: any, res: any) => {
    const filePath = req?.file?.path;

    const user = await getCurrentUser(req.cookies.token);
    user.id = await getUserId(user.username);

    const old_icon_path = await fetchUserIconPath(user.id);
    if (old_icon_path !== "" || old_icon_path !== null) {
        await deleteFile(old_icon_path);
    }

    const icon_upload = await uploadUserIcon(user.id, filePath);

    return res.status(200).json(filePath);
});

module.exports = router;
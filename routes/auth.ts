const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
import { authenticateToken } from "../controllers/auth";
import { User } from "../definitions";
import { getGroupIdByName } from "../utils/groups";
import { fetchUserIconPath, getCurrentUser, getUserId } from "../utils/users";
const { fetchUsers } = require('../controllers/users');
const { createUser, findUserByUsername } = require('../utils/users');


router.post("/api/register", async (req: any, res: any) => {
    try {
        const { username, password, email, name, last_name }: User = req.body;
        if (!(email && password && username && name && last_name)) {
            return res.status(400).send("All input is required");
        }
        const hashed_password = await bcrypt.hash(password, 10);

        const group_id = await getGroupIdByName("user");

        const user = await createUser({ username, password: hashed_password, email, name, last_name, group_id });

        if (user) {
            return res.status(201).send("User created.");
        } else {
            return res.status(400).send("Unable to create user.");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error registering user");
    }
});

router.post("/api/login", fetchUsers, async (req: any, res: any) => {
    try {
        const { username, password }: User = req.body;
        const { users } = res.locals;

        const user: User = users.find((user: User) => user.username === username);

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password.toString());

            if (validPassword) {
                const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                res.cookie("token", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 3600000
                });

                res.status(200).send("Login successful");
            } else {
                res.status(400).send('Invalid username or password');
            }
        } else {
            res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error")
    }
});

router.get("/api/logout", (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.send("Logged out");
});

router.get("/api/privileges", authenticateToken, async (req, res) => {
    try {
        const token = req.cookies.token; // Assuming you have the token stored in a cookie named 'token'
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await findUserByUsername(decoded.username); // Implement findUserByUsername to fetch user data
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return necessary user information
        res.json({ isAdmin: user.isAdmin });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }

});

router.get("/api/auth", authenticateToken, async (req: any, res: any) => {
    const user = await getCurrentUser(req.cookies.token);
    if (user) {
        user.id = await getUserId(user.username);
        const user_icon_path = await fetchUserIconPath(user.id);
        user.icon = user_icon_path;
        return res.status(200).json(user);
    } else {
        return res.status(401).send("User not logged in.");
    }
});

module.exports = router;
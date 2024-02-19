"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var fs = require('fs').promises;
var path = require('path');
var auth_1 = require("../controllers/auth");
var groups_1 = require("../utils/groups");
var users_1 = require("../utils/users");
var fetchUsers = require('../controllers/users').fetchUsers;
var _a = require('../utils/users'), createUser = _a.createUser, findUserByUsername = _a.findUserByUsername;
router.post("/api/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, email, name_1, last_name, hashed_password, group_id, user, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password, email = _a.email, name_1 = _a.name, last_name = _a.last_name;
                if (!(email && password && username && name_1 && last_name)) {
                    return [2 /*return*/, res.status(400).send("All input is required")];
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1:
                hashed_password = _b.sent();
                return [4 /*yield*/, (0, groups_1.getGroupIdByName)("user")];
            case 2:
                group_id = _b.sent();
                return [4 /*yield*/, createUser({ username: username, password: hashed_password, email: email, name: name_1, last_name: last_name, group_id: group_id })];
            case 3:
                user = _b.sent();
                return [2 /*return*/, res.status(201).send("User created.")];
            case 4:
                error_1 = _b.sent();
                console.error(error_1);
                return [2 /*return*/, res.status(500).send("Error registering user")];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post("/api/login", fetchUsers, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username_1, password, users, user, validPassword, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username_1 = _a.username, password = _a.password;
                users = res.locals.users;
                user = users.find(function (user) { return user.username === username_1; });
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, bcrypt.compare(password, user.password.toString())];
            case 1:
                validPassword = _b.sent();
                if (validPassword) {
                    accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                    res.cookie("token", accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 3600000
                    });
                    res.status(200).send("Login successful");
                }
                else {
                    res.status(400).send('Invalid username or password');
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send('Invalid username or password');
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).send("Server error");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/api/logout", function (req, res) {
    res.cookie("token", "", { maxAge: 0 });
    res.send("Logged out");
});
router.get("/api/privileges", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                token = req.cookies.token;
                if (!token) {
                    return [2 /*return*/, res.status(403).json({ message: "No token provided" })];
                }
                decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                return [4 /*yield*/, findUserByUsername(decoded.username)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                // Return necessary user information
                res.json({ isAdmin: user.isAdmin });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(401).json({ message: "Invalid token" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/api/auth", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, user_icon_path;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(req.cookies.token)];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 4];
                // export icon fetching to seperate function
                _a = user;
                return [4 /*yield*/, (0, users_1.getUserId)(user.username)];
            case 2:
                // export icon fetching to seperate function
                _a.id = _b.sent();
                return [4 /*yield*/, (0, users_1.fetchUserIconPath)(user.id)];
            case 3:
                user_icon_path = _b.sent();
                return [2 /*return*/, res.status(200).json(user)];
            case 4: return [2 /*return*/, res.status(401).send("User not logged in.")];
        }
    });
}); });
module.exports = router;

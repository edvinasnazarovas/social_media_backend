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
var auth_1 = require("../controllers/auth");
var media_1 = require("../utils/media");
var posts_1 = require("../utils/posts");
var users_1 = require("../utils/users");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        // You can use the original name or add a timestamp for uniqueness
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });
var express = require("express");
var router = express.Router();
router.get("/api/posts", auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, posts_1.fetchPosts)()];
            case 1:
                posts = _a.sent();
                return [2 /*return*/, res.status(200).json(posts)];
        }
    });
}); });
router.post("/api/posts", auth_1.authenticateToken, upload.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, user_id, filePath, fileName, fileSize, media_id, post_obj, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.body.description && req.file)) {
                    return [2 /*return*/, res.status(400).send("Please provide all values.")];
                }
                token = req.cookies.token;
                if (!token) {
                    return [2 /*return*/, res.status(401).send("No token")];
                }
                return [4 /*yield*/, (0, users_1.getCurrentUser)(token)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, (0, users_1.getUserId)(user.username)];
            case 2:
                user_id = _a.sent();
                filePath = req.file.path;
                fileName = req.file.filename;
                fileSize = req.file.size;
                return [4 /*yield*/, (0, media_1.createMedia)(filePath)];
            case 3:
                media_id = _a.sent();
                post_obj = { description: req.body.description, user_id: user_id, media_id: media_id };
                return [4 /*yield*/, (0, posts_1.createPost)(post_obj)];
            case 4:
                post = _a.sent();
                return [2 /*return*/, res.status(200).send(JSON.stringify({ user_id: user_id, filePath: filePath, fileName: fileName, fileSize: fileSize }))];
        }
    });
}); });
module.exports = router;

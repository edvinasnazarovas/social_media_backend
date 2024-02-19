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
var users_1 = require("../utils/users");
var express = require('express');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        // You can use the original name or add a timestamp for uniqueness
        cb(null, Date.now() + '-' + file.originalname);
    },
    fileFilter: function (req, file, cb) {
        // Check the file's mimetype to be an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept file
        }
        else {
            cb(new Error('Only image files are allowed!'), false); // Reject file
        }
    },
});
var upload = multer({ storage: storage });
router.post("/api/users/icon", auth_1.authenticateToken, upload.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filePath, user, _a, old_icon_path, icon_upload;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                filePath = (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path;
                return [4 /*yield*/, (0, users_1.getCurrentUser)(req.cookies.token)];
            case 1:
                user = _c.sent();
                _a = user;
                return [4 /*yield*/, (0, users_1.getUserId)(user.username)];
            case 2:
                _a.id = _c.sent();
                return [4 /*yield*/, (0, users_1.fetchUserIconPath)(user.id)];
            case 3:
                old_icon_path = _c.sent();
                if (!(old_icon_path !== "" || old_icon_path !== null)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, users_1.deleteFile)(old_icon_path)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5: return [4 /*yield*/, (0, users_1.uploadUserIcon)(user.id, filePath)];
            case 6:
                icon_upload = _c.sent();
                return [2 /*return*/, res.status(200).json(filePath)];
        }
    });
}); });
module.exports = router;

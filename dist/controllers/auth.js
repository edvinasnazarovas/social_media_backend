"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
var express = require('express');
var db = require('../db');
var jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    var token = req.cookies.token;
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
exports.authenticateToken = authenticateToken;
module.exports = { authenticateToken: authenticateToken };

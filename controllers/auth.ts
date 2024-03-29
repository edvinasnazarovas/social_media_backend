const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

export function authenticateToken(req: any, res: any, next: any) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken};
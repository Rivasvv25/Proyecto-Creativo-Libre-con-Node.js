const express = require('express');
const router = express.Router();
const sessionService = require('./sessions.service');
const { createSessionSchema } = require('./sessions.validation');

router.post('/sessions', (req, res, next) => {
    try {
        const validatedData = createSessionSchema.parse(req.body);
        const session = sessionService.createSession(validatedData);
        res.status(201).json(session);
    } catch (error) {
        next(error);
    }
});

router.get('/sessions', (req, res, next) => {
    try {
        const date = req.query.date;
        const sessions = sessionService.getSessions(date);
        res.json(sessions);
    } catch (error) {
        next(error);
    }
});

router.get('/stats', (req, res, next) => {
    try {
        const date = req.query.date;
        const stats = sessionService.getStats(date);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

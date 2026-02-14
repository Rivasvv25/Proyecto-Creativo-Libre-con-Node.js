const express = require('express');
const router = express.Router();
const reportsService = require('./reports.service');

router.get('/today', (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const report = reportsService.getReport(today);
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ message: 'Report not generated yet' });
        }
    } catch (error) {
        next(error);
    }
});

router.post('/generate', (req, res, next) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const report = reportsService.generateReport(date);
        res.json(report);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

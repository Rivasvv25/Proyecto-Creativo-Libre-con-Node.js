const reportsRepo = require('./reports.repo');
const sessionsRepo = require('../sessions/sessions.repo');

const generateReport = (date) => {
    const existingReport = reportsRepo.getReportByDate(date);
    if (existingReport) {
        return existingReport;
    }

    const stats = sessionsRepo.getStatsByDate(date);

    const report = {
        date: date,
        totalSessions: stats.totalSessions,
        totalWorkMinutes: stats.totalWorkMinutes,
        totalBreakMinutes: stats.totalBreakMinutes,
        generatedAt: new Date().toISOString(),
    };

    return reportsRepo.createReport(report);
};

const getReport = (date) => {
    return reportsRepo.getReportByDate(date);
};

module.exports = {
    generateReport,
    getReport,
};

const db = require('../../db/sqlite');

const createReport = (report) => {
    const stmt = db.prepare(`
    INSERT INTO daily_reports (date, total_sessions, total_work_minutes, total_break_minutes, generated_at)
    VALUES (@date, @totalSessions, @totalWorkMinutes, @totalBreakMinutes, @generatedAt)
  `);
    stmt.run(report);
    return report;
};

const getReportByDate = (date) => {
    const stmt = db.prepare(`
    SELECT * FROM daily_reports WHERE date = @date
  `);
    return stmt.get({ date });
};

module.exports = {
    createReport,
    getReportByDate,
};

const db = require('../../db/sqlite');

const createSession = (session) => {
    const stmt = db.prepare(`
    INSERT INTO pomodoro_sessions (label, work_minutes, break_minutes, started_at, ended_at, notes)
    VALUES (@label, @workMinutes, @breakMinutes, @startedAt, @endedAt, @notes)
  `);
    const info = stmt.run(session);
    return { id: info.lastInsertRowid, ...session };
};

const getSessionsByDate = (date) => {
    const stmt = db.prepare(`
    SELECT * FROM pomodoro_sessions
    WHERE date(started_at) = @date
    ORDER BY started_at DESC
  `);
    return stmt.all({ date });
};

const getStatsByDate = (date) => {
    const stmt = db.prepare(`
        SELECT
            COUNT(*) as totalSessions,
            COALESCE(SUM(work_minutes), 0) as totalWorkMinutes,
            COALESCE(SUM(break_minutes), 0) as totalBreakMinutes
        FROM pomodoro_sessions
        WHERE date(started_at) = @date
    `);
    return stmt.get({ date });
}

module.exports = {
    createSession,
    getSessionsByDate,
    getStatsByDate
};

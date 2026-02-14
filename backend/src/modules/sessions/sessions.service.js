const sessionRepo = require('./sessions.repo');

const createSession = (data) => {
    const workMinutes = data.workMinutes;
    const startedAt = data.startedAt ? new Date(data.startedAt) : new Date();
    const endedAt = new Date(startedAt.getTime() + workMinutes * 60000);

    const session = {
        label: data.label,
        workMinutes: data.workMinutes,
        breakMinutes: data.breakMinutes || 5,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        notes: data.notes || null,
    };

    return sessionRepo.createSession(session);
};

const getSessions = (date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return sessionRepo.getSessionsByDate(targetDate);
};

const getStats = (date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return sessionRepo.getStatsByDate(targetDate);
}

module.exports = {
    createSession,
    getSessions,
    getStats
};

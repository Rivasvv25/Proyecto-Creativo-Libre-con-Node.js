const app = require('./app');
const db = require('./db/sqlite');
const { initCron } = require('./modules/reports/reports.cron.js');

const PORT = process.env.PORT || 3000;

// Initialize Database Migration
try {
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.resolve(__dirname, 'db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('Database migrated successfully on startup.');
} catch (err) {
    console.error('Migration failed:', err);
}

// Initialize Cron Jobs
initCron();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

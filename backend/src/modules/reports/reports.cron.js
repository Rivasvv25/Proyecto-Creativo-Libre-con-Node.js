const cron = require('node-cron');
const reportsService = require('./reports.service');

const initCron = () => {
    // Run at 23:59 every day
    cron.schedule('59 23 * * *', () => {
        const today = new Date().toISOString().split('T')[0];
        console.log(`Running daily report generation for ${today}...`);
        try {
            reportsService.generateReport(today);
            console.log(`Daily report for ${today} generated successfully.`);
        } catch (error) {
            console.error(`Error generating daily report for ${today}:`, error);
        }
    });
    console.log('Daily report cron job scheduled (23:59).');
};

module.exports = { initCron };

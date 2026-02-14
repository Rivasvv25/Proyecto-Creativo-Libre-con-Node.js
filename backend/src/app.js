const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const sessionsRouter = require('./modules/sessions/sessions.routes');
const reportsRouter = require('./modules/reports/reports.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Security and Logging
app.use(helmet());
app.use(morgan('dev'));

// Body Parser
app.use(express.json({ limit: '100kb' }));

// Static Files
app.use(express.static(path.join(__dirname, '../../frontend')));

// API Routes
app.use('/api', sessionsRouter);
app.use('/api/reports', reportsRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: err.errors,
            },
        });
    }

    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An internal server error occurred',
        },
    });
};

module.exports = errorHandler;

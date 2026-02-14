const { z } = require('zod');

const createSessionSchema = z.object({
    label: z.string().min(1).max(40),
    workMinutes: z.number().int().min(1).max(120),
    breakMinutes: z.number().int().min(0).max(60).default(5),
    startedAt: z.string().datetime().optional(),
    notes: z.string().max(280).optional(),
});

module.exports = {
    createSessionSchema,
};

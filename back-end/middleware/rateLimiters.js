import { rateLimit } from 'express-rate-limit';

export const garmothRateLimit = rateLimit({
    windowMs: 5 * 1000,
    max: 1,
    message: '5 seconds delay between requests',
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 52,
});
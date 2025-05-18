import { pino } from 'pino';

// const level = process.env['NODE_ENV'] === 'development' ? 'trace' : 'info';
const level = 'trace'; // for the moment

const logger =
    process.env['NODE_ENV'] === 'development'
        ? pino({ level, transport: { target: 'pino-pretty' } })
        : pino({ level });

export { logger };

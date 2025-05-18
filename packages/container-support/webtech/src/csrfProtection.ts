import { csrf } from 'hono/csrf';

export const csrfProtection = () =>
    csrf({
        origin: ['https://vorschlagswesen.online', 'http://localhost:4000'],
    });

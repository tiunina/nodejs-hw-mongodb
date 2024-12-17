import pino from 'pino-http';

export const logger = pino({
  transpost: {
    target: 'pimo-pretty',
  },
});

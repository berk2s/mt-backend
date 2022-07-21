/**
 * @module app.config
 */

import winston, { format } from 'winston'
import 'winston-daily-rotate-file'

/**
 * Log system configuration
 */
const logConfig = {
  transports: [
    new winston.transports.DailyRotateFile({
      filename: './logs/application-%DATE%.log',
      datePattern: 'MM-DD-YYYY',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '1d',
    }),
    new winston.transports.Stream({
      stream: process.stderr,
      level: 'debug',
    }),
  ],
  format: format.combine(
    format.timestamp({
      format: 'MM-DD-YYYY HH:MM',
    }),
    format.colorize(),
    format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`),
  ),
}

export default logConfig

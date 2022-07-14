import colors from '@colors/colors';
import {format} from 'fecha';
import type {Logger, QueryOptions} from 'winston';

colors.setTheme({
  info: 'green',
  debug: 'blue',
  warn: 'yellow',
  error: 'red'
});

export const queryLog = (options?: QueryOptions) => new Promise<{
  file: {
    timestamp: string,
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string
  }[]}>((resolve ,reject) => {
    global.logger.query(options || {
      from: new Date(new Date().valueOf() - 60*60*3*1e3),
      until: new Date(),
      limit: 100,
      start: 0,
      order: 'asc',
      fields: ['level', 'timestamp', 'message']
    }, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

const log = (level, msg) => {
  const date = format(new Date(), 'DD/MM/YYYY - HH:mm:ss');
  console.log(`[${colors.blue(date)}] ${colors[level](level)}: ${msg}`);
};

// fallback logger
export const fallback = {
  info: msg => log('info', msg),
  debug: msg => log('debug', msg),
  warn: msg => log('warn', msg),
  error: msg => log('error', msg)
};

export default global.logger as Logger;

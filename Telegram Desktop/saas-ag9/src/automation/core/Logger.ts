export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  constructor(private prefix = 'Automation') {}

  private format(level: LogLevel, message: string, data?: unknown) {
    const time = new Date().toISOString();
    return `[${time}] [${this.prefix}] [${level.toUpperCase()}] ${message}` + (data !== undefined ? ` :: ${JSON.stringify(data)}` : '');
  }

  debug(message: string, data?: unknown) { console.debug(this.format('debug', message, data)); }
  info(message: string, data?: unknown) { console.info(this.format('info', message, data)); }
  warn(message: string, data?: unknown) { console.warn(this.format('warn', message, data)); }
  error(message: string, data?: unknown) { console.error(this.format('error', message, data)); }
}

export const logger = new Logger();
import pino from 'pino';

/**
 * Structured logger for the ticket service using Pino.
 * 
 * @class Logger
 */
export default class Logger {
  #pinoLogger;

  /**
   * Creates a new Logger instance.
   * 
   * @param {Object} [options={}] - Pino logger options
   * @param {Object} [context={}] - Default context for all log entries
   */
  constructor(options = {}, context = {}) {
    const defaultOptions = {
      name: 'ticket-service',
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label) => {
          return { level: label };
        }
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      base: {
        service: 'ticket-service',
        version: process.env.SERVICE_VERSION || '1.0.0',
        ...context
      },
      transport: process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: { colorize: true }
          }
        : undefined
    };

    this.#pinoLogger = pino({ ...defaultOptions, ...options });
  }

  /**
   * Creates a child logger with additional context.
   * 
   * @param {Object} additionalContext - Additional context to merge
   * @returns {Logger} New logger instance with merged context
   */
  child(additionalContext) {
    const childLogger = new Logger();
    childLogger.#pinoLogger = this.#pinoLogger.child(additionalContext);
    return childLogger;
  }

  /**
   * Logs an info level message.
   * 
   * @param {string} message - The log message
   * @param {Object} [data={}] - Additional data to log
   */
  info(message, data = {}) {
    this.#pinoLogger.info(data, message);
  }

  /**
   * Logs a warning level message.
   * 
   * @param {string} message - The log message
   * @param {Object} [data={}] - Additional data to log
   */
  warn(message, data = {}) {
    this.#pinoLogger.warn(data, message);
  }

  /**
   * Logs an error level message.
   * 
   * @param {string} message - The log message
   * @param {Object} [data={}] - Additional data to log
   */
  error(message, data = {}) {
    this.#pinoLogger.error(data, message);
  }

  /**
   * Logs a debug level message.
   * 
   * @param {string} message - The log message
   * @param {Object} [data={}] - Additional data to log
   */
  debug(message, data = {}) {
    const currentLevel = this.#pinoLogger.level;
    const needsTempElevation = !this.#pinoLogger.isLevelEnabled('debug');
    if (needsTempElevation) {
      this.#pinoLogger.level = 'debug';
    }
    try {
      this.#pinoLogger.debug(data, message);
    } finally {
      if (needsTempElevation) {
        this.#pinoLogger.level = currentLevel;
      }
    }
  }

  /**
   * Logs a trace level message.
   * 
   * @param {string} message - The log message
   * @param {Object} [data={}] - Additional data to log
   */
  trace(message, data = {}) {
    const currentLevel = this.#pinoLogger.level;
    const needsTempElevation = !this.#pinoLogger.isLevelEnabled('trace');
    if (needsTempElevation) {
      this.#pinoLogger.level = 'trace';
    }
    try {
      this.#pinoLogger.trace(data, message);
    } finally {
      if (needsTempElevation) {
        this.#pinoLogger.level = currentLevel;
      }
    }
  }

  /**
   * Logs a fatal level message.
   * 
   * @param {string} message - The log message
   * @param {Object} [data={}] - Additional data to log
   */
  fatal(message, data = {}) {
    this.#pinoLogger.fatal(data, message);
  }

  /**
   * Gets the underlying Pino logger instance.
   * 
   * @returns {pino.Logger} The Pino logger instance
   */
  getPinoLogger() {
    return this.#pinoLogger;
  }

  /**
   * Sets the log level.
   * 
   * @param {string} level - The log level (trace, debug, info, warn, error, fatal)
   */
  setLevel(level) {
    this.#pinoLogger.level = level;
  }

  /**
   * Gets the current log level.
   * 
   * @returns {string} The current log level
   */
  getLevel() {
    return this.#pinoLogger.level;
  }

  /**
   * Checks if a log level is enabled.
   * 
   * @param {string} level - The log level to check
   * @returns {boolean} True if the level is enabled
   */
  isLevelEnabled(level) {
    return this.#pinoLogger.isLevelEnabled(level);
  }
}
  
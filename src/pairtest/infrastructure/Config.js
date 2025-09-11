/**
 * Configuration management for the ticket service.
 * 
 * @class Config
 */
export default class Config {
  #config;

  /**
   * Creates a new Config instance.
   * 
   * @param {Object} [overrides={}] - Configuration overrides
   */
  constructor(overrides = {}) {
    this.#config = {
      // Ticket pricing configuration
      ticketPrices: {
        ADULT: parseInt(process.env.ADULT_TICKET_PRICE) || 25,
        CHILD: parseInt(process.env.CHILD_TICKET_PRICE) || 15,
        INFANT: 0 // Always free
      },

      // Business rules configuration
      maxTicketsPerPurchase: parseInt(process.env.MAX_TICKETS_PER_PURCHASE) || 25,


      // Logging configuration
      logLevel: process.env.LOG_LEVEL || 'info',
      enableMetrics: process.env.ENABLE_METRICS === 'true' || false,
      // Environment
      environment: process.env.NODE_ENV || 'development',
      serviceName: process.env.SERVICE_NAME || 'ticket-service',
      serviceVersion: process.env.SERVICE_VERSION || '1.0.0',

      // Apply overrides
      ...overrides
    };
  }

  /**
   * Gets a configuration value by key.
   * 
   * @param {string} key - The configuration key (supports dot notation)
   * @param {*} [defaultValue] - Default value if key not found
   * @returns {*} The configuration value
   * @example
   * config.get('ticketPrices.ADULT') // 25
   * config.get('nonexistent.key', 'default') // 'default'
   */
  get(key, defaultValue = undefined) {
    const keys = key.split('.');
    let value = this.#config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Sets a configuration value by key.
   * 
   * @param {string} key - The configuration key (supports dot notation)
   * @param {*} value - The value to set
   * @example
   * config.set('ticketPrices.ADULT', 30)
   */
  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = this.#config;

    for (const k of keys) {
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }

    target[lastKey] = value;
  }

  /**
   * Gets all configuration as a plain object.
   * 
   * @returns {Object} All configuration values
   */
  getAll() {
    return { ...this.#config };
  }

  /**
   * Checks if a configuration key exists.
   * 
   * @param {string} key - The configuration key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Gets ticket prices configuration.
   * 
   * @returns {Object} Ticket prices
   */
  getTicketPrices() {
    return { ...this.#config.ticketPrices };
  }

  /**
   * Gets the maximum tickets per purchase.
   * 
   * @returns {number} Maximum tickets
   */
  getMaxTicketsPerPurchase() {
    return this.#config.maxTicketsPerPurchase;
  }

  /**
   * Gets the current environment.
   * 
   * @returns {string} Environment name
   */
  getEnvironment() {
    return this.#config.environment;
  }

  /**
   * Checks if the current environment is production.
   * 
   * @returns {boolean} True if production
   */
  isProduction() {
    return this.#config.environment === 'production';
  }

  /**
   * Checks if the current environment is development.
   * 
   * @returns {boolean} True if development
   */
  isDevelopment() {
    return this.#config.environment === 'development';
  }

}

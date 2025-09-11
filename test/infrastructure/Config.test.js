import Config from '../../src/pairtest/infrastructure/Config.js';

describe('Config', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  describe('default configuration', () => {
    test('should have default ticket prices', () => {
      const config = new Config();
      
      expect(config.get('ticketPrices.ADULT')).toBe(25);
      expect(config.get('ticketPrices.CHILD')).toBe(15);
      expect(config.get('ticketPrices.INFANT')).toBe(0);
    });

    test('should have default max tickets', () => {
      const config = new Config();
      
      expect(config.getMaxTicketsPerPurchase()).toBe(25);
    });

    test('should have default environment', () => {
      const config = new Config();
      
      expect(config.getEnvironment()).toBe('test');
      expect(config.isDevelopment()).toBe(false);
      expect(config.isProduction()).toBe(false);
    });
  });

  describe('environment variable configuration', () => {
    test('should read ticket prices from environment', () => {
      process.env.ADULT_TICKET_PRICE = '30';
      process.env.CHILD_TICKET_PRICE = '20';
      
      const config = new Config();
      
      expect(config.get('ticketPrices.ADULT')).toBe(30);
      expect(config.get('ticketPrices.CHILD')).toBe(20);
    });

    test('should read max tickets from environment', () => {
      process.env.MAX_TICKETS_PER_PURCHASE = '50';
      
      const config = new Config();
      
      expect(config.getMaxTicketsPerPurchase()).toBe(50);
    });

    test('should read environment from NODE_ENV', () => {
      process.env.NODE_ENV = 'production';
      
      const config = new Config();
      
      expect(config.getEnvironment()).toBe('production');
      expect(config.isProduction()).toBe(true);
      expect(config.isDevelopment()).toBe(false);
    });
  });

  describe('configuration overrides', () => {
    test('should accept configuration overrides', () => {
      const config = new Config({
        ticketPrices: { ADULT: 100 },
        maxTicketsPerPurchase: 10
      });
      
      expect(config.get('ticketPrices.ADULT')).toBe(100);
      expect(config.getMaxTicketsPerPurchase()).toBe(10);
    });
  });

  describe('get and set methods', () => {
    test('should get configuration values with dot notation', () => {
      const config = new Config();
      
      expect(config.get('ticketPrices.ADULT')).toBe(25);
      expect(config.get('nonexistent.key', 'default')).toBe('default');
    });

    test('should set configuration values with dot notation', () => {
      const config = new Config();
      
      config.set('ticketPrices.ADULT', 50);
      
      expect(config.get('ticketPrices.ADULT')).toBe(50);
    });

    test('should check if configuration key exists', () => {
      const config = new Config();
      
      expect(config.has('ticketPrices.ADULT')).toBe(true);
      expect(config.has('nonexistent.key')).toBe(false);
    });
  });

  
  describe('helper methods', () => {
    test('should get all ticket prices', () => {
      const config = new Config();
      const prices = config.getTicketPrices();
      
      expect(prices).toEqual({
        ADULT: 25,
        CHILD: 15,
        INFANT: 0
      });
    });

    test('should get all configuration', () => {
      const config = new Config();
      const allConfig = config.getAll();
      
      expect(allConfig).toHaveProperty('ticketPrices');
      expect(allConfig).toHaveProperty('maxTicketsPerPurchase');
      expect(allConfig).toHaveProperty('environment');
    });
  });
});

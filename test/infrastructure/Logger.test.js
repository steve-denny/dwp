import Logger from '../../src/pairtest/infrastructure/Logger.js';

describe('Logger', () => {
  let logger;
  let writeSpy;

  beforeEach(() => {
    // Mock process.stdout.write to capture Pino output
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
    logger = new Logger({ level: 'info' });
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  describe('basic logging', () => {
    test('should log info messages', () => {
      logger.info('Test message', { key: 'value' });
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"info"')
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"msg":"Test message"')
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"key":"value"')
      );
    });

    test('should log error messages', () => {
      logger.error('Error message', { error: 'details' });
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"error"')
      );
    });

    test('should log warning messages', () => {
      logger.warn('Warning message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"warn"')
      );
    });

    test('should log debug messages', () => {
      logger.debug('Debug message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"debug"')
      );
    });

    test('should log trace messages', () => {
      logger.trace('Trace message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"trace"')
      );
    });

    test('should log fatal messages', () => {
      logger.fatal('Fatal message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"fatal"')
      );
    });
  });

  describe('context handling', () => {
    test('should include default context in all logs', () => {
      const loggerWithContext = new Logger({}, { service: 'test-service' });
      loggerWithContext.info('Test message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"service":"test-service"')
      );
    });

    test('should create child logger with merged context', () => {
      const parentLogger = new Logger({}, { service: 'parent' });
      const childLogger = parentLogger.child({ operation: 'test' });
      
      childLogger.info('Test message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"service":"parent"')
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"operation":"test"')
      );
    });

    test('should override parent context with child context', () => {
      const parentLogger = new Logger({}, { service: 'parent', version: '1.0' });
      const childLogger = parentLogger.child({ service: 'child' });
      
      childLogger.info('Test message');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"service":"child"')
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('"version":"1.0"')
      );
    });
  });

  describe('timestamp', () => {
    test('should include timestamp in all log entries', () => {
      const beforeTime = new Date().toISOString();
      logger.info('Test message');
      const afterTime = new Date().toISOString();
      
      const logCall = writeSpy.mock.calls[0][0];
      const logEntry = JSON.parse(logCall);
      
      expect(logEntry.time).toBeDefined();
      expect(logEntry.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(logEntry.time >= beforeTime).toBe(true);
      expect(logEntry.time <= afterTime).toBe(true);
    });
  });

  describe('log level management', () => {
    test('should get current log level', () => {
      expect(logger.getLevel()).toBe('info');
    });

    test('should set log level', () => {
      logger.setLevel('debug');
      expect(logger.getLevel()).toBe('debug');
    });

    test('should check if level is enabled', () => {
      expect(logger.isLevelEnabled('info')).toBe(true);
      expect(logger.isLevelEnabled('debug')).toBe(false);
      
      logger.setLevel('debug');
      expect(logger.isLevelEnabled('debug')).toBe(true);
    });
  });

  describe('Pino logger access', () => {
    test('should provide access to underlying Pino logger', () => {
      const pinoLogger = logger.getPinoLogger();
      expect(pinoLogger).toBeDefined();
      expect(typeof pinoLogger.info).toBe('function');
    });
  });
});

import TicketQuantityValidationStrategy from '../../src/pairtest/validation/TicketQuantityValidationStrategy.js';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';
import { MAX_TICKET, ERROR_MESSAGES } from '../../src/pairtest/constants/TicketConstants.js';

describe('TicketQuantityValidationStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new TicketQuantityValidationStrategy();
  });

  describe('validate', () => {
    test('should not throw for valid ticket quantities within limit', () => {
      expect(() => strategy.validate(1)).not.toThrow();
      expect(() => strategy.validate(10)).not.toThrow();
      expect(() => strategy.validate(MAX_TICKET)).not.toThrow();
    });

    test('should throw InvalidPurchaseException for quantities exceeding maximum', () => {
      expect(() => strategy.validate(MAX_TICKET + 1)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(MAX_TICKET + 10)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(100)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for zero tickets', () => {
      expect(() => strategy.validate(0)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(0)).toThrow(ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET));
    });

    test('should throw InvalidPurchaseException for negative quantities', () => {
      expect(() => strategy.validate(-1)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(-10)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(-MAX_TICKET)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for non-integer quantities', () => {
      expect(() => strategy.validate(1.5)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(10.99)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(0.1)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for string quantities', () => {
      expect(() => strategy.validate('10')).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate('abc')).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate('')).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for null quantity', () => {
      expect(() => strategy.validate(null)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for undefined quantity', () => {
      expect(() => strategy.validate(undefined)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for NaN quantity', () => {
      expect(() => strategy.validate(NaN)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for Infinity quantity', () => {
      expect(() => strategy.validate(Infinity)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(-Infinity)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for boolean quantity', () => {
      expect(() => strategy.validate(true)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(false)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for object quantity', () => {
      expect(() => strategy.validate({})).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate({ count: 10 })).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for array quantity', () => {
      expect(() => strategy.validate([])).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate([10])).toThrow(InvalidPurchaseException);
    });
  });

  describe('edge cases', () => {
    test('should handle exactly the maximum ticket limit', () => {
      expect(() => strategy.validate(MAX_TICKET)).not.toThrow();
    });

    test('should reject one ticket over the maximum', () => {
      expect(() => strategy.validate(MAX_TICKET + 1)).toThrow(InvalidPurchaseException);
    });

    test('should handle very large numbers', () => {
      expect(() => strategy.validate(Number.MAX_SAFE_INTEGER)).toThrow(InvalidPurchaseException);
    });

    test('should handle very small numbers', () => {
      expect(() => strategy.validate(Number.MIN_SAFE_INTEGER)).toThrow(InvalidPurchaseException);
    });

    test('should handle decimal numbers that are close to integers', () => {
      expect(() => strategy.validate(10.0)).not.toThrow(); // This is actually an integer
      expect(() => strategy.validate(10.1)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(9.9)).toThrow(InvalidPurchaseException);
    });
  });

  describe('error message validation', () => {
    test('should include correct maximum ticket count in error message', () => {
      try {
        strategy.validate(MAX_TICKET + 1);
        fail('Expected InvalidPurchaseException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPurchaseException);
        expect(error.message).toContain(MAX_TICKET.toString());
        expect(error.message).toContain('Maximum of');
        expect(error.message).toContain('tickets can be purchased');
      }
    });

    test('should use the correct error message function', () => {
      const expectedMessage = ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET);
      
      try {
        strategy.validate(MAX_TICKET + 1);
        fail('Expected InvalidPurchaseException to be thrown');
      } catch (error) {
        expect(error.message).toBe(expectedMessage);
      }
    });
  });

  describe('boundary testing', () => {
    test('should accept all valid quantities from 1 to MAX_TICKET', () => {
      for (let i = 1; i <= MAX_TICKET; i++) {
        expect(() => strategy.validate(i)).not.toThrow();
      }
    });

    test('should reject quantities just over the maximum', () => {
      for (let i = MAX_TICKET + 1; i <= MAX_TICKET + 5; i++) {
        expect(() => strategy.validate(i)).toThrow(InvalidPurchaseException);
      }
    });
  });
});

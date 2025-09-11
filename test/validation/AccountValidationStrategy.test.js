import AccountValidationStrategy from '../../src/pairtest/validation/AccountValidationStrategy.js';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';
import { ERROR_MESSAGES } from '../../src/pairtest/constants/TicketConstants.js';
import ValidationContext from '../../src/pairtest/validation/ValidationContext.js';
describe('AccountValidationStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new AccountValidationStrategy();
  });

  describe('validate', () => {
    test('should not throw for valid positive integer account ID', () => {
      expect(() => strategy.validate(new ValidationContext(1, [], 1))).not.toThrow();
      expect(() => strategy.validate(new ValidationContext(123, [], 123))).not.toThrow();
      expect(() => strategy.validate(new ValidationContext(999999, [], 999999))).not.toThrow();
    });

    test('should throw InvalidPurchaseException for zero account ID', () => {
      expect(() => strategy.validate(new ValidationContext(0, [], 0))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(0, [], 0))).toThrow(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
    });

    test('should throw InvalidPurchaseException for negative account ID', () => {
      expect(() => strategy.validate(new ValidationContext(-1, [], -1))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(-100, [], -100))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(-999999, [], -999999))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for non-integer account ID', () => {
      expect(() => strategy.validate(new ValidationContext(1.5, [], 1.5))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(123.99, [], 123.99))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(0.1, [], 0.1))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for string account ID', () => {
      expect(() => strategy.validate(new ValidationContext('123', [], '123'))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext('abc', [], 'abc'))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext('', [], ''))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for null account ID', () => {
      expect(() => strategy.validate(new ValidationContext(null, [], null))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for undefined account ID', () => {
      expect(() => strategy.validate(new ValidationContext(undefined, [], undefined))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for NaN account ID', () => {
      expect(() => strategy.validate(new ValidationContext(NaN, [], NaN))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for Infinity account ID', () => {
      expect(() => strategy.validate(new ValidationContext(Infinity, [], Infinity))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(-Infinity, [], -Infinity))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for boolean account ID', () => {
      expect(() => strategy.validate(new ValidationContext(true, [], true))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext(false, [], false))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for object account ID', () => {
      expect(() => strategy.validate(new ValidationContext({}, [], {}))).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(new ValidationContext({ id: 123 }, [], { id: 123 }))).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for array account ID', () => {
      expect(() => strategy.validate(new ValidationContext([], [], [])).toThrow(InvalidPurchaseException));
      expect(() => strategy.validate(new ValidationContext([123], [], [123])).toThrow(InvalidPurchaseException));
    });
  });

  describe('edge cases', () => {
    test('should handle very large positive integers', () => {
      expect(() => strategy.validate(new ValidationContext(Number.MAX_SAFE_INTEGER, [], Number.MAX_SAFE_INTEGER))).not.toThrow();
    });

    test('should handle very small positive integers', () => {
      expect(() => strategy.validate(new ValidationContext(1, [], 1))).not.toThrow();
    });

    test('should handle zero as edge case', () => {
      expect(() => strategy.validate(new ValidationContext(0, [], 0))).toThrow(InvalidPurchaseException);
    });
  });
});

import TicketRequestValidationStrategy from '../../src/pairtest/validation/TicketRequestValidationStrategy.js';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';
import { TICKET_TYPES, ERROR_MESSAGES } from '../../src/pairtest/constants/TicketConstants.js';

describe('TicketRequestValidationStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new TicketRequestValidationStrategy();
  });

  describe('validate', () => {
    test('should not throw for valid array of TicketTypeRequest objects', () => {
      const validRequests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2)
      ];

      expect(() => strategy.validate(validRequests)).not.toThrow();
    });

    test('should not throw for single TicketTypeRequest object', () => {
      const singleRequest = [new TicketTypeRequest(TICKET_TYPES.ADULT, 1)];

      expect(() => strategy.validate(singleRequest)).not.toThrow();
    });

    test('should throw InvalidPurchaseException for null ticket requests', () => {
      expect(() => strategy.validate(null)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(null)).toThrow(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    });

    test('should throw InvalidPurchaseException for undefined ticket requests', () => {
      expect(() => strategy.validate(undefined)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(undefined)).toThrow(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    });

    test('should throw InvalidPurchaseException for empty array', () => {
      expect(() => strategy.validate([])).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate([])).toThrow(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    });

    test('should throw InvalidPurchaseException for non-array input', () => {
      expect(() => strategy.validate('not an array')).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(123)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate({})).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(true)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for array with non-TicketTypeRequest objects', () => {
      const invalidRequests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        { type: TICKET_TYPES.CHILD, count: 2 }, // Plain object
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(invalidRequests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(invalidRequests)).toThrow(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    });

    test('should throw InvalidPurchaseException for array with null elements', () => {
      const requestsWithNull = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        null,
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2)
      ];

      expect(() => strategy.validate(requestsWithNull)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for array with undefined elements', () => {
      const requestsWithUndefined = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        undefined,
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2)
      ];

      expect(() => strategy.validate(requestsWithUndefined)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for array with primitive values', () => {
      const requestsWithPrimitives = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        'invalid',
        123,
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2)
      ];

      expect(() => strategy.validate(requestsWithPrimitives)).toThrow(InvalidPurchaseException);
    });

    test('should throw InvalidPurchaseException for array with wrong object types', () => {
      const requestsWithWrongTypes = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new Date(),
        new Error('test'),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2)
      ];

      expect(() => strategy.validate(requestsWithWrongTypes)).toThrow(InvalidPurchaseException);
    });
  });

  describe('edge cases', () => {
    test('should handle array with many valid TicketTypeRequest objects', () => {
      const manyRequests = Array.from({ length: 100 }, (_, i) => 
        new TicketTypeRequest(TICKET_TYPES.ADULT, i + 1)
      );

      expect(() => strategy.validate(manyRequests)).not.toThrow();
    });

    test('should handle array with mixed valid ticket types', () => {
      const mixedRequests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(mixedRequests)).not.toThrow();
    });

    test('should validate each element in the array', () => {
      const requestsWithOneInvalid = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        'invalid',
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1)
      ];

      expect(() => strategy.validate(requestsWithOneInvalid)).toThrow(InvalidPurchaseException);
    });
  });

  describe('instanceof check', () => {
    test('should properly identify TicketTypeRequest instances', () => {
      const validRequest = new TicketTypeRequest(TICKET_TYPES.ADULT, 1);
      expect(validRequest instanceof TicketTypeRequest).toBe(true);
    });

    test('should reject objects that are not TicketTypeRequest instances', () => {
      const fakeRequest = {
        getTicketType: () => TICKET_TYPES.ADULT,
        getNoOfTickets: () => 1
      };

      expect(fakeRequest instanceof TicketTypeRequest).toBe(false);
    });
  });
});

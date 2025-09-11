import TicketDependencyValidationStrategy from '../../src/pairtest/validation/TicketDependencyValidationStrategy.js';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';
import { TICKET_TYPES, ERROR_MESSAGES } from '../../src/pairtest/constants/TicketConstants.js';

describe('TicketDependencyValidationStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new TicketDependencyValidationStrategy();
  });

  describe('validate - Adult ticket requirements', () => {
    test('should not throw when only adult tickets are purchased', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should not throw when adult and child tickets are purchased', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should not throw when adult and infant tickets are purchased', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should not throw when adult, child, and infant tickets are purchased', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should throw when only child tickets are purchased', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1)
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT);
    });

    test('should throw when only infant tickets are purchased', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT);
    });

    test('should throw when child and infant tickets are purchased without adult', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT);
    });
  });

  describe('validate - Infant ticket limits', () => {
    test('should not throw when infant tickets equal adult tickets', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should not throw when infant tickets are less than adult tickets', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 3),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should throw when infant tickets exceed adult tickets', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
    });

    test('should throw when infant tickets exceed adult tickets with multiple adult tickets', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 3)
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
    });

    test('should handle complex scenarios with multiple ticket types', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2) // Equal to adults - should pass
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle complex scenarios with too many infants', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2) // More than adults - should fail
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
    });
  });

  describe('validate - Edge cases', () => {
    test('should handle empty array', () => {
      expect(() => strategy.validate([])).not.toThrow();
    });

    test('should handle multiple adult tickets with no infants', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 5),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 3)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle valid adult and child without infant', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle valid adult and infant without child', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle valid adult only', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });
  });

  describe('validate - Multiple requests of same type', () => {
    test('should handle multiple adult ticket requests', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle multiple infant ticket requests', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 3),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle multiple child ticket requests', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 2),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should fail when total infants exceed total adults across multiple requests', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1) // Total: 2 infants, 1 adult
      ];

      expect(() => strategy.validate(requests)).toThrow(InvalidPurchaseException);
      expect(() => strategy.validate(requests)).toThrow(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
    });
  });

  describe('validate - Error message validation', () => {
    test('should use correct error message for child/infant without adult', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.CHILD, 1)
      ];

      try {
        strategy.validate(requests);
        fail('Expected InvalidPurchaseException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPurchaseException);
        expect(error.message).toBe(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT);
      }
    });

    test('should use correct error message for infant limit exceeded', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
      ];

      try {
        strategy.validate(requests);
        fail('Expected InvalidPurchaseException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPurchaseException);
        expect(error.message).toBe(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
      }
    });
  });

  describe('validate - Complex scenarios', () => {
    test('should handle large numbers of tickets', () => {
      const requests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 10),
        new TicketTypeRequest(TICKET_TYPES.CHILD, 5),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 10)
      ];

      expect(() => strategy.validate(requests)).not.toThrow();
    });

    test('should handle mixed valid and invalid scenarios', () => {
      // Valid: 2 adults, 1 infant
      const validRequests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      ];
      expect(() => strategy.validate(validRequests)).not.toThrow();

      // Invalid: 1 adult, 2 infants
      const invalidRequests = [
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
      ];
      expect(() => strategy.validate(invalidRequests)).toThrow(InvalidPurchaseException);
    });
  });
});

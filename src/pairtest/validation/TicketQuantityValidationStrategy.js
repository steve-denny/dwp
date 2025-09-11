import ValidationStrategy from './ValidationStrategy.js';
import InvalidPurchaseException from '../lib/InvalidPurchaseException.js';
import { MAX_TICKET, ERROR_MESSAGES } from '../constants/TicketConstants.js';

/**
 * Validation strategy for ticket quantity validation.
 * 
 * @class TicketQuantityValidationStrategy
 * @extends {ValidationStrategy}
 */
export default class TicketQuantityValidationStrategy extends ValidationStrategy {
  /**
   * Validates that the total ticket quantity is valid and doesn't exceed the maximum allowed.
   * 
   * @param {ValidationContext|number} context - The validation context or raw totalTickets
   * @throws {InvalidPurchaseException} When ticket quantity is invalid or exceeds maximum
   */
  validate(context) {
    const totalTickets = (typeof context === 'number')
      ? context
      : (typeof context?.getTotalTickets === 'function' ? context.getTotalTickets() : undefined);
    
    // Validate input type and value
    if (!Number.isInteger(totalTickets) || totalTickets <= 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET));
    }
    
    // Validate maximum limit
    if (totalTickets > MAX_TICKET) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET));
    }
  }
}

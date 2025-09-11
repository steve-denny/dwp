import ValidationStrategy from './ValidationStrategy.js';
import InvalidPurchaseException from '../lib/InvalidPurchaseException.js';
import TicketTypeRequest from '../lib/TicketTypeRequest.js';
import { ERROR_MESSAGES } from '../constants/TicketConstants.js';

/**
 * Validation strategy for ticket request validation.
 * 
 * @class TicketRequestValidationStrategy
 * @extends {ValidationStrategy}
 */
export default class TicketRequestValidationStrategy extends ValidationStrategy {
  /**
   * Validates that ticket requests are provided and are valid TicketTypeRequest instances.
   * 
   * @param {ValidationContext|TicketTypeRequest[]} context - The validation context or raw ticket requests
   * @throws {InvalidPurchaseException} When ticket requests are invalid
   */
  validate(context) {
    const ticketTypeRequests = Array.isArray(context)
      ? context
      : (typeof context?.getTicketRequests === 'function' ? context.getTicketRequests() : undefined);
    if (!ticketTypeRequests || !Array.isArray(ticketTypeRequests) || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    }
    
    for (const request of ticketTypeRequests) {
      if (!(request instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
      }
    }
  }
}

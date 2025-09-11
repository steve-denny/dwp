import ValidationStrategy from './ValidationStrategy.js';
import InvalidPurchaseException from '../lib/InvalidPurchaseException.js';
import { TICKET_TYPES, ERROR_MESSAGES } from '../constants/TicketConstants.js';

/**
 * Validation strategy for ticket dependency rules.
 * 
 * @class TicketDependencyValidationStrategy
 * @extends {ValidationStrategy}
 */
export default class TicketDependencyValidationStrategy extends ValidationStrategy {
  /**
   * Validates ticket dependency rules (Child/Infant require Adult, Infant ≤ Adult).
   * 
   * @param {ValidationContext|TicketTypeRequest[]} context - The validation context or raw ticket requests
   * @throws {InvalidPurchaseException} When dependency rules are violated
   */
  validate(context) {
    const ticketTypeRequests = Array.isArray(context)
      ? context
      : (typeof context?.getTicketRequests === 'function' ? context.getTicketRequests() : undefined);
    const adultCount = this.#getTicketCount(ticketTypeRequests, TICKET_TYPES.ADULT);
    const childCount = this.#getTicketCount(ticketTypeRequests, TICKET_TYPES.CHILD);
    const infantCount = this.#getTicketCount(ticketTypeRequests, TICKET_TYPES.INFANT);
    
    // Child and Infant tickets cannot be purchased without Adult tickets
    if ((childCount > 0 || infantCount > 0) && adultCount === 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT);
    }
    
    // Number of infant tickets must be less than or equal to adult tickets
    if (infantCount > adultCount) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INFANT_TICKET_LIMIT);
    }
  }

  /**
   * Gets the total count of a specific ticket type from the requests.
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @param {string} ticketType - The ticket type to count
   * @returns {number} Total count of the specified ticket type
   */
  #getTicketCount(ticketTypeRequests, ticketType) {
    return ticketTypeRequests
      .filter(request => request.getTicketType() === ticketType)
      .reduce((total, request) => total + request.getNoOfTickets(), 0);
  }
}

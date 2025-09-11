/**
 * Immutable ticket type request object.
 * 
 * Represents a request for a specific number of tickets of a particular type.
 * This class is immutable - once created, the ticket type and quantity cannot be changed.
 * 
 * @class TicketTypeRequest
 */
import { TICKET_TYPES, ERROR_MESSAGES } from '../constants/TicketConstants.js';

export default class TicketTypeRequest {
  #type;
  #noOfTickets;

  /**
   * Creates a new TicketTypeRequest instance.
   * 
   * @param {string} type - The ticket type (ADULT, CHILD, or INFANT)
   * @param {number} noOfTickets - The number of tickets (must be positive integer)
   * @throws {TypeError} When ticket type is invalid or number of tickets is invalid
   * @example
   * // Create a request for 2 adult tickets
   * const adultRequest = new TicketTypeRequest(TICKET_TYPES.ADULT, 2);
   * 
   * // Create a request for 1 child ticket
   * const childRequest = new TicketTypeRequest(TICKET_TYPES.CHILD, 1);
   */
  constructor(type, noOfTickets) {
    if (!this.#Type.includes(type)) {
      throw new TypeError(ERROR_MESSAGES.INVALID_TICKET_TYPE);
    }

    if (!Number.isInteger(noOfTickets) || noOfTickets <= 0) {
      throw new TypeError(ERROR_MESSAGES.INVALID_TICKET_COUNT);
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  /**
   * Gets the number of tickets requested.
   * 
   * @returns {number} The number of tickets
   * @example
   * const request = new TicketTypeRequest(TICKET_TYPES.ADULT, 3);
   * console.log(request.getNoOfTickets()); // 3
   */
  getNoOfTickets() {
    return this.#noOfTickets;
  }

  /**
   * Gets the ticket type.
   * 
   * @returns {string} The ticket type (ADULT, CHILD, or INFANT)
   * @example
   * const request = new TicketTypeRequest(TICKET_TYPES.CHILD, 1);
   * console.log(request.getTicketType()); // "CHILD"
   */
  getTicketType() {
    return this.#type;
  }

  /** @private */
  #Type = [TICKET_TYPES.ADULT, TICKET_TYPES.CHILD, TICKET_TYPES.INFANT];
}

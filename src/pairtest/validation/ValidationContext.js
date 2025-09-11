/**
 * Validation context object that contains all data to be validated.
 * 
 * @class ValidationContext
 */
export default class ValidationContext {
  #accountId;
  #ticketRequests;
  #totalTickets;

  /**
   * Creates a new ValidationContext instance.
   * 
   * @param {number} accountId - The account ID to validate
   * @param {TicketTypeRequest[]} ticketRequests - Array of ticket requests to validate
   * @param {number} totalTickets - Total number of tickets to validate
   */
  constructor(accountId, ticketRequests, totalTickets) {
    this.#accountId = accountId;
    this.#ticketRequests = ticketRequests;
    this.#totalTickets = totalTickets;
  }

  /**
   * Gets the account ID.
   * 
   * @returns {number} The account ID
   */
  getAccountId() {
    return this.#accountId;
  }

  /**
   * Gets the ticket requests.
   * 
   * @returns {TicketTypeRequest[]} Array of ticket requests
   */
  getTicketRequests() {
    return this.#ticketRequests;
  }

  /**
   * Gets the total number of tickets.
   * 
   * @returns {number} Total number of tickets
   */
  getTotalTickets() {
    return this.#totalTickets;
  }

}

import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { TICKET_TYPES, TICKET_PRICES, MAX_TICKET, ERROR_MESSAGES } from './constants/TicketConstants.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

/**
 * Service for purchasing cinema tickets with business rule validation.
 * 
 * This service handles ticket purchases by validating business rules,
 * calculating costs, processing payments, and reserving seats.
 * 
 * @class TicketService
 */
export default class TicketService {
  #paymentService;
  #seatReservationService;

  /**
   * Creates an instance of TicketService.
   * 
   * @param {TicketPaymentService} [paymentService=new TicketPaymentService()] - Service for processing payments
   * @param {SeatReservationService} [seatReservationService=new SeatReservationService()] - Service for reserving seats
   */
  constructor(paymentService = new TicketPaymentService(), seatReservationService = new SeatReservationService()) {
    this.#paymentService = paymentService;
    this.#seatReservationService = seatReservationService;
  }

  /**
   * Purchases tickets for a given account with validation of business rules.
   * 
   * Business Rules:
   * - Account ID must be a positive integer > 0
   * - Maximum 25 tickets can be purchased at once
   * - Child and Infant tickets require at least one Adult ticket
   * - Number of Infant tickets must be ≤ number of Adult tickets
   * - Infants don't pay for tickets and don't get seats
   * 
   * @param {number} accountId - The account ID (must be positive integer > 0)
   * @param {...TicketTypeRequest} ticketTypeRequests - Variable number of ticket requests
   * @throws {InvalidPurchaseException} When business rules are violated
   * @example
   * // Purchase 2 adults, 1 child, 1 infant
   * ticketService.purchaseTickets(
   *   123,
   *   new TicketTypeRequest(TICKET_TYPES.ADULT, 2),
   *   new TicketTypeRequest(TICKET_TYPES.CHILD, 1),
   *   new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
   * );
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountId(accountId);
    this.#validateTicketRequests(ticketTypeRequests);
    
    const totalTickets = this.#calculateTotalTickets(ticketTypeRequests);
    this.#validateTicketQuantity(totalTickets);
    
    this.#validateTicketDependencies(ticketTypeRequests);
    
    const totalAmount = this.#calculateTotalAmount(ticketTypeRequests);
    const totalSeats = this.#calculateTotalSeats(ticketTypeRequests);
    
    this.#paymentService.makePayment(accountId, totalAmount);
    this.#seatReservationService.reserveSeat(accountId, totalSeats);
  }

  /**
   * Validates that the account ID is a positive integer.
   * 
   * @private
   * @param {number} accountId - The account ID to validate
   * @throws {InvalidPurchaseException} When account ID is invalid
   */
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
    }
  }

  /**
   * Validates that ticket requests are provided and are valid TicketTypeRequest instances.
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests to validate
   * @throws {InvalidPurchaseException} When ticket requests are invalid
   */
  #validateTicketRequests(ticketTypeRequests) {
    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    }
    
    for (const request of ticketTypeRequests) {
      if (!(request instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
      }
    }
  }

  /**
   * Calculates the total number of tickets across all requests.
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @returns {number} Total number of tickets
   */
  #calculateTotalTickets(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => total + request.getNoOfTickets(), 0);
  }

  /**
   * Validates that the total ticket quantity doesn't exceed the maximum allowed.
   * 
   * @private
   * @param {number} totalTickets - Total number of tickets to validate
   * @throws {InvalidPurchaseException} When ticket quantity exceeds maximum
   */
  #validateTicketQuantity(totalTickets) {
    if (totalTickets > MAX_TICKET) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET));
    }
  }

  /**
   * Validates ticket dependency rules (Child/Infant require Adult, Infant ≤ Adult).
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @throws {InvalidPurchaseException} When dependency rules are violated
   */
  #validateTicketDependencies(ticketTypeRequests) {
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

  /**
   * Calculates the total amount to be paid (excludes infant tickets which are free).
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @returns {number} Total amount to be paid
   */
  #calculateTotalAmount(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => {
      const ticketType = request.getTicketType();
      const count = request.getNoOfTickets();
      return total + (TICKET_PRICES[ticketType] * count);
    }, 0);
  }

  /**
   * Calculates the total number of seats to reserve (excludes infant tickets).
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @returns {number} Total number of seats to reserve
   */
  #calculateTotalSeats(ticketTypeRequests) {
    // Infants don't get seats, only Adults and Children do
    return ticketTypeRequests.reduce((total, request) => {
      const ticketType = request.getTicketType();
      const count = request.getNoOfTickets();
      return total + (ticketType === TICKET_TYPES.INFANT ? 0 : count);
    }, 0);
  }
}

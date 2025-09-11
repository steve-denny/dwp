import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import { TICKET_TYPES, TICKET_PRICES, MAX_TICKET, ERROR_MESSAGES } from './constants/TicketConstants.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

// Import new infrastructure components
import ValidationOrchestrator from './validation/ValidationOrchestrator.js';
import ValidationContext from './validation/ValidationContext.js';
import AccountValidationStrategy from './validation/AccountValidationStrategy.js';
import TicketRequestValidationStrategy from './validation/TicketRequestValidationStrategy.js';
import TicketQuantityValidationStrategy from './validation/TicketQuantityValidationStrategy.js';
import TicketDependencyValidationStrategy from './validation/TicketDependencyValidationStrategy.js';
import Logger from './infrastructure/Logger.js';
import Config from './infrastructure/Config.js';

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
  #validationOrchestrator;
  #logger;
  #config;

  /**
   * Creates an instance of TicketService.
   * 
   * @param {TicketPaymentService} [paymentService=new TicketPaymentService()] - Service for processing payments
   * @param {SeatReservationService} [seatReservationService=new SeatReservationService()] - Service for reserving seats
   * @param {Logger} [logger=new Logger()] - Logger for logging
   * @param {Config} [config=new Config()] - Configuration manager
   */
  constructor(
    paymentService = new TicketPaymentService(), 
    seatReservationService = new SeatReservationService(),
    logger = new Logger(),
    config = new Config()
  ) {
    this.#paymentService = paymentService;
    this.#seatReservationService = seatReservationService;
    this.#logger = logger.child({ service: 'TicketService' });
    this.#config = config;
    
    // Initialize validation orchestrator with strategies
    this.#validationOrchestrator = new ValidationOrchestrator([
      new AccountValidationStrategy(),
      new TicketRequestValidationStrategy(),
      new TicketQuantityValidationStrategy(),
      new TicketDependencyValidationStrategy()
    ]);

    this.#logger.info('TicketService initialized', {
      maxTickets: this.#config.getMaxTicketsPerPurchase(),
      environment: this.#config.getEnvironment()
    });
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
    const startTime = Date.now();

    try {
      //request validation
      this.#validateInput(accountId, ...ticketTypeRequests);
      const totalTickets = this.#calculateTotalTickets(ticketTypeRequests);
      
      // Create validation context with all data
      const validationContext = new ValidationContext(accountId, ticketTypeRequests, totalTickets);
      
      // Validate all business rules using the context
      this.#validationOrchestrator.validate(validationContext);
      
      this.#logger.info('Ticket purchase initiated', {
        accountId,
        ticketCount: ticketTypeRequests.length,
        ticketTypes: ticketTypeRequests.map(req => req.getTicketType())
      });
      
      const totalAmount = this.#calculateTotalAmount(ticketTypeRequests);
      const totalSeats = this.#calculateTotalSeats(ticketTypeRequests);
      
      // Process payment and seat reservation
      this.#paymentService.makePayment(accountId, totalAmount);
      this.#seatReservationService.reserveSeat(accountId, totalSeats);

      // This is  a metric, but we are not using it for now
      const duration = Date.now() - startTime;
    
      
      this.#logger.info('Ticket purchase completed successfully', {
        accountId,
        totalAmount,
        totalSeats,
        totalTickets,
        duration
      });
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.#logger.error('Ticket purchase failed', {
        accountId,
        error: error.message,
        errorType: error.constructor.name,
        duration
      });
      
      throw error;
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
   * Calculates the total amount to be paid (excludes infant tickets which are free).
   * 
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @returns {number} Total amount to be paid
   */
  #calculateTotalAmount(ticketTypeRequests) {
    const ticketPrices = this.#config.getTicketPrices();
    return ticketTypeRequests.reduce((total, request) => {
      const ticketType = request.getTicketType();
      const count = request.getNoOfTickets();
      return total + (ticketPrices[ticketType] * count);
    }, 0);
  }
  
  /**
   * Validates the input parameters.
   * 
   * @private
   * @param {number} accountId - The account ID
   * @param {...TicketTypeRequest} ticketTypeRequests - Variable number of ticket requests
   * @throws {InvalidPurchaseException} When input is invalid
   */
  #validateInput(accountId, ...ticketTypeRequests) {
    if(!accountId) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
    }
    if (
      !ticketTypeRequests.every(
        req => req && typeof req === 'object' && req.constructor && req.constructor.name === 'TicketTypeRequest'
      )
    ) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    }
    if(!ticketTypeRequests ) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST);
    }
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

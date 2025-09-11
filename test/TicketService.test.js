import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import { TICKET_PRICES, MAX_TICKET, TICKET_TYPES, ERROR_MESSAGES } from "../src/pairtest/constants/TicketConstants.js";
import Logger from "../src/pairtest/infrastructure/Logger.js";
import Config from "../src/pairtest/infrastructure/Config.js";  

describe(`${TicketService.name}`, () => {
  let ticketService;
  let paymentService;
  let seatReservationService;

  beforeEach(() => {
    paymentService = { makePayment: jest.fn() };
    seatReservationService = { reserveSeat: jest.fn() };
    ticketService = new TicketService(
      paymentService,
      seatReservationService,
      new Logger(),
      new Config()
    );
  });

  describe("Account validation", () => {
    const invalidAccountError = new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);

    test("throws when account ID is zero", () => {
      expect(() => ticketService.purchaseTickets(0, new TicketTypeRequest(TICKET_TYPES.ADULT, 1))).toThrow(
        invalidAccountError
      );
    });

    test("throws when account ID is negative", () => {
      expect(() => ticketService.purchaseTickets(-1, new TicketTypeRequest(TICKET_TYPES.ADULT, 1))).toThrow(
        invalidAccountError
      );
    });

    test("throws when account ID is not an integer", () => {
      expect(() => ticketService.purchaseTickets(1.5, new TicketTypeRequest(TICKET_TYPES.ADULT, 1))).toThrow(
        invalidAccountError
      );
    });
  });

  describe("Request validation", () => {
    test("throws when no ticket requests are provided", () => {
      expect(() => ticketService.purchaseTickets(1)).toThrow(
        new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST)
      );
    });

    test("throws when any request is not a TicketTypeRequest", () => {
      expect(() => ticketService.purchaseTickets(1, { type: TICKET_TYPES.ADULT, no: 1 })).toThrow(
        new InvalidPurchaseException(ERROR_MESSAGES.INVALID_TICKET_TYPE_REQUEST)
      );
    });
  });

  describe("Ticket quantity limits", () => {
    test("throws when total tickets exceed maximum", () => {
      expect(() =>
        ticketService.purchaseTickets(1, new TicketTypeRequest(TICKET_TYPES.ADULT, MAX_TICKET + 1))
      ).toThrow(new InvalidPurchaseException(ERROR_MESSAGES.MAX_TICKETS(MAX_TICKET)));
    });
  });

  describe("Ticket type dependency rules", () => {
    test("throws when CHILD only without ADULT", () => {
      expect(() => ticketService.purchaseTickets(1, new TicketTypeRequest(TICKET_TYPES.CHILD, 1))).toThrow(
        new InvalidPurchaseException(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT)
      );
    });

    test("throws when INFANT only without ADULT", () => {
      expect(() => ticketService.purchaseTickets(1, new TicketTypeRequest(TICKET_TYPES.INFANT, 1))).toThrow(
        new InvalidPurchaseException(ERROR_MESSAGES.CHILD_INFANT_WITHOUT_ADULT)
      );
    });

    test("throws when INFANT tickets exceed ADULT tickets", () => {
      expect(() =>
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
          new TicketTypeRequest(TICKET_TYPES.INFANT, 2)
        )
      ).toThrow(new InvalidPurchaseException(ERROR_MESSAGES.INFANT_TICKET_LIMIT));
    });
  });

  describe("Payment calculation and seat reservation", () => {
    test("charges only for ADULT and CHILD and reserves seats excluding INFANT", () => {
      const accountId = 10;
      const adult = 3;
      const child = 2;
      const infant = 2; // infant <= adult (3)
      const expectedPayment = adult * TICKET_PRICES[TICKET_TYPES.ADULT] + child * TICKET_PRICES[TICKET_TYPES.CHILD];
      const expectedSeats = adult + child;

      adultTicket = new TicketTypeRequest(TICKET_TYPES.ADULT, adult);
      childTicket = new TicketTypeRequest(TICKET_TYPES.CHILD, child);
      infantTicket = new TicketTypeRequest(TICKET_TYPES.INFANT, infant);

  
      ticketService.purchaseTickets(
        accountId,
        adultTicket,
        childTicket,
        infantTicket
      );

      expect(paymentService.makePayment).toHaveBeenCalledTimes(1);
      expect(paymentService.makePayment).toHaveBeenCalledWith(accountId, expectedPayment);
      expect(seatReservationService.reserveSeat).toHaveBeenCalledTimes(1);
      expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(accountId, expectedSeats);
    });

    test("reserves seats for ADULT only when INFANT present", () => {
      const accountId = 11;
      ticketService.purchaseTickets(
        accountId,
        new TicketTypeRequest(TICKET_TYPES.ADULT, 1),
        new TicketTypeRequest(TICKET_TYPES.INFANT, 1)
      );

      expect(seatReservationService.reserveSeat).toHaveBeenCalledWith(accountId, 1);
    });

    test("should processes payment before seat reservation", () => {
      ticketService.purchaseTickets(1, new TicketTypeRequest(TICKET_TYPES.ADULT, 1));
      expect(paymentService.makePayment).toHaveBeenCalled();
      expect(seatReservationService.reserveSeat).toHaveBeenCalled();
      expect(paymentService.makePayment.mock.invocationCallOrder[0]).toBeLessThan(
        seatReservationService.reserveSeat.mock.invocationCallOrder[0]
      );
    });
  });

  test("can construct TicketService with default dependencies", () => {
    const svc = new TicketService();
    expect(svc).toBeDefined();
  });
});
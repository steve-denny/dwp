import { jest } from '@jest/globals';
import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';

describe('TicketService', () => {
  let paymentSpy;
  let seatSpy;
  let service;

  beforeEach(() => {
    paymentSpy = jest
      .spyOn(TicketPaymentService.prototype, 'makePayment')
      .mockImplementation(() => {});
    seatSpy = jest
      .spyOn(SeatReservationService.prototype, 'reserveSeat')
      .mockImplementation(() => {});

    service = new TicketService();
  });

  afterEach(() => {
    paymentSpy.mockRestore();
    seatSpy.mockRestore();
  });

  test('processes a valid purchase and calls payment and seat services with correct values', () => {
    service.purchaseTickets(
      1,
      new TicketTypeRequest('ADULT', 2),
      new TicketTypeRequest('CHILD', 1),
      new TicketTypeRequest('INFANT', 1)
    );

    expect(paymentSpy).toHaveBeenCalledWith(1, 65);

    expect(seatSpy).toHaveBeenCalledWith(1, 3);
  });

  test('throws when more than 25 tickets are requested', () => {
    const tooMany = new TicketTypeRequest('ADULT', 26);
    expect(() => service.purchaseTickets(1, tooMany)).toThrow(InvalidPurchaseException);
  });

  test('allows exactly 25 tickets and calculates correctly', () => {
    const twentyFive = new TicketTypeRequest('ADULT', 25);
    service.purchaseTickets(1, twentyFive);
    expect(paymentSpy).toHaveBeenCalledWith(1, 25 * 25);
    expect(seatSpy).toHaveBeenCalledWith(1, 25);
  });

  test('throws when child tickets are purchased without any adult', () => {
    const childOnly = new TicketTypeRequest('CHILD', 1);
    expect(() => service.purchaseTickets(1, childOnly)).toThrow(InvalidPurchaseException);
  });

  test('throws when infant tickets are purchased without any adult', () => {
    const infantOnly = new TicketTypeRequest('INFANT', 1);
    expect(() => service.purchaseTickets(1, infantOnly)).toThrow(InvalidPurchaseException);
  });

  test('throws for invalid accountId values', () => {
    const adult = new TicketTypeRequest('ADULT', 1);
    expect(() => service.purchaseTickets(0, adult)).toThrow(InvalidPurchaseException);
    expect(() => service.purchaseTickets(-5, adult)).toThrow(InvalidPurchaseException);
    expect(() => service.purchaseTickets('abc', adult)).toThrow(InvalidPurchaseException);
  });

  test('TicketTypeRequest rejects invalid ticket types and non-integer counts', () => {
    expect(() => new TicketTypeRequest('SENIOR', 1)).toThrow(TypeError);
    expect(() => new TicketTypeRequest('ADULT', 1.5)).toThrow(TypeError);
  });
});

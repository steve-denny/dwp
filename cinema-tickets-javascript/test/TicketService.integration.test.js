import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService.js');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService.js');

import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';

describe('TicketService Integration', () => {
  let service;

  beforeEach(() => {
    service = new TicketService();
    TicketPaymentService.mockClear();
    SeatReservationService.mockClear();
  });

  test('end-to-end happy path flow for valid purchase', async () => {
    const accountId = 1122334455;
    await expect(service.purchaseTickets(accountId,
      new TicketTypeRequest('ADULT', 3),
      new TicketTypeRequest('CHILD', 2),
      new TicketTypeRequest('INFANT', 1)
    )).resolves.not.toThrow();

    // Ticket purchase cost = (3*25 + 2*15) = £105
    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(accountId, 105);

    // Total Seats to reserve 3+2 = 5 seats (as infants don’t get seats)
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(accountId, 5);
  });
});
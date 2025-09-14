import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validatePurchase(accountId, ticketTypeRequests);

    const totalAmount = this.#calculateTotalAmount(ticketTypeRequests);
    const totalSeats = this.#calculateSeatsToReserve(ticketTypeRequests);

    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalAmount);

    const seatService = new SeatReservationService();
    seatService.reserveSeat(accountId, totalSeats);
  }

  #validatePurchase(accountId, ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException('Invalid accountId');
    }

    const totalTickets = ticketTypeRequests.reduce(
      (sum, req) => sum + req.getNoOfTickets(),
      0
    );

    if (totalTickets > 25) {
      throw new InvalidPurchaseException('Cannot purchase more than 25 tickets');
    }

    const numAdultTickets = ticketTypeRequests
      .filter(req => req.getTicketType() === 'ADULT')
      .reduce((sum, req) => sum + req.getNoOfTickets(), 0);

    const numChildOrInfantTickets = ticketTypeRequests
      .filter(req => req.getTicketType() === 'CHILD' || req.getTicketType() === 'INFANT')
      .reduce((sum, req) => sum + req.getNoOfTickets(), 0);

    if (numChildOrInfantTickets > 0 && numAdultTickets === 0) {
      throw new InvalidPurchaseException(
        'Child or Infant tickets cannot be purchased without an Adult ticket'
      );
    }
  }

  #calculateTotalAmount(ticketTypeRequests) {
    let total = 0;
    for (const req of ticketTypeRequests) {
      switch (req.getTicketType()) {
        case 'ADULT':
          total += req.getNoOfTickets() * 25;
          break;
        case 'CHILD':
          total += req.getNoOfTickets() * 15;
          break;
        case 'INFANT':
          break;
      }
    }
    return total;
  }

  #calculateSeatsToReserve(ticketTypeRequests) {
    let seats = 0;
    for (const req of ticketTypeRequests) {
      switch (req.getTicketType()) {
        case 'ADULT':
        case 'CHILD':
          seats += req.getNoOfTickets();
          break;
        case 'INFANT':
          break;
      }
    }
    return seats;
  }
}

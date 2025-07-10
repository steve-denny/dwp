import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

 async purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    if(!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException('Invalid account ID');
    }

    const requests = ticketTypeRequests;
    if (requests.length === 0) {
      throw new InvalidPurchaseException('No tickets requested');
    }

    const PRICES = {ADULT: 25, CHILD: 15, INFANT:0};
    const SEAT_REQUIRED = { ADULT: true, CHILD: true, INFANT: false };
    const ticketSummary = {ADULT:0, CHILD:0, INFANT:0};

    let totalTickets = 0;
    let totalAmount = 0;
    let seatsToReserve = 0;
    const seenTypes = new Set()

    for (const req of requests) {
      const type = req.getTicketType();
      if (seenTypes.has(type)) {
        throw new InvalidPurchaseException(`Duplicate ticket type: ${type}`);
      }
      seenTypes.add(type);
      const count = req.getNoOfTickets();
    
    if(!PRICES.hasOwnProperty(type)) {
      throw new InvalidPurchaseException(`Invalid ticket type: ${type}`);
    }
    if(count < 0) {
      throw new InvalidPurchaseException(`Invalid number of tickets for ${type}`);
    }

    ticketSummary[type] += count;
    if(type !== 'INFANT') {
    totalTickets += count; // total tickets = Adult ticket + Child ticket (since infants do not occupy a seat)
    }
    totalAmount += count * PRICES[type];
    if (SEAT_REQUIRED[type]) {
      seatsToReserve += count;
    }
  }
console.log('Total tickets:', totalTickets);
   if(totalTickets === 0) {
      throw new InvalidPurchaseException('Atleast one ticket must be purchased');
    }

   if(totalTickets > 25) {
      throw new InvalidPurchaseException('Cannot purchase more than 25 tickets');
    }

    if(ticketSummary.ADULT === 0 && (ticketSummary.CHILD > 0 || ticketSummary.INFANT > 0)) {
      console.log('No adult ticket with child or infant!');
      throw new InvalidPurchaseException('Child or infant tickets require at least one adult ticket');
    }

    if (ticketSummary.INFANT > ticketSummary.ADULT) {  // Since one adult can hold only one infant on their lap.
      throw new InvalidPurchaseException('Every infant must be accompanied by atleast one adult');
    }

    new TicketPaymentService().makePayment(accountId, totalAmount);
    new SeatReservationService().reserveSeat(accountId, seatsToReserve);
    console.log(`Paid £${totalAmount} and Reserved ${seatsToReserve} seats for account ${accountId}`);
  }
}

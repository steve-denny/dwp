package uk.gov.dwp.uc.pairtest;

import thirdparty.paymentgateway.TicketPaymentService;
import thirdparty.seatbooking.SeatReservationService;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

public class TicketServiceImpl implements TicketService {

    private static final int ADULT_TICKET_PRICE = 25;
    private static final int CHILD_TICKET_PRICE = 15;
    private static final int INFANT_TICKET_PRICE = 0;

    private final TicketPaymentService ticketPaymentService;
    private final SeatReservationService seatReservationService;

    public TicketServiceImpl(TicketPaymentService ticketPaymentService,
                             SeatReservationService seatReservationService) {
        this.ticketPaymentService = ticketPaymentService;
        this.seatReservationService = seatReservationService;
    }

    @Override
    public void purchaseTickets(final Long accountId, final TicketTypeRequest... ticketTypeRequests)
            throws InvalidPurchaseException {

        validateAccountId(accountId);

        final int totalAmountToPay = calculateTotalAmount(ticketTypeRequests);
        final int totalSeatsToAllocate = calculateTotalSeats(ticketTypeRequests);

        seatReservationService.reserveSeat(accountId, totalSeatsToAllocate);
        ticketPaymentService.makePayment(accountId, totalAmountToPay);
    }

    private void validateAccountId(final Long accountId) {
        if (accountId == null || accountId <= 0) {
            throw new InvalidPurchaseException();
        }
    }

    private int calculateTotalAmount(final TicketTypeRequest... ticketTypeRequests) {
        int totalAmount = 0;
        for (final TicketTypeRequest request : ticketTypeRequests) {
            switch (request.getTicketType()) {
                case ADULT:
                    totalAmount += request.getNoOfTickets() * ADULT_TICKET_PRICE;
                    break;
                case CHILD:
                    totalAmount += request.getNoOfTickets() * CHILD_TICKET_PRICE;
                    break;
                case INFANT:
                    totalAmount += request.getNoOfTickets() * INFANT_TICKET_PRICE;
                    break;
            }
        }
        return totalAmount;
    }

    private int calculateTotalSeats(final TicketTypeRequest... ticketTypeRequests) {
        int totalSeats = 0;
        for (final TicketTypeRequest request : ticketTypeRequests) {
            if (request.getTicketType() == TicketTypeRequest.Type.ADULT || request.getTicketType() == TicketTypeRequest.Type.CHILD) {
                totalSeats += request.getNoOfTickets();
            }
        }
        return totalSeats;
    }
}


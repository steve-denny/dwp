package uk.gov.dwp.uc.pairtest;

import thirdparty.paymentgateway.TicketPaymentService;
import thirdparty.seatbooking.SeatReservationService;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

public class TicketServiceImpl implements TicketService {

    private static final int ADULT_TICKET_PRICE = 25;
    private static final int CHILD_TICKET_PRICE = 15;

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

        int totalSeatsToAllocate = 0;
        int totalAmountToPay = 0;

        for (final TicketTypeRequest request : ticketTypeRequests) {
            switch (request.getTicketType()) {
                case ADULT:
                    totalSeatsToAllocate += request.getNoOfTickets();
                    totalAmountToPay += request.getNoOfTickets() * ADULT_TICKET_PRICE;
                    break;
                case CHILD:
                    totalSeatsToAllocate += request.getNoOfTickets();
                    totalAmountToPay += request.getNoOfTickets() * CHILD_TICKET_PRICE;
                    break;
                case INFANT:
                    // Infants do not cost money or take up a seat, so no action is needed here yet.
                    break;
            }
        }

        seatReservationService.reserveSeat(accountId, totalSeatsToAllocate);
        ticketPaymentService.makePayment(accountId, totalAmountToPay);
    }
}


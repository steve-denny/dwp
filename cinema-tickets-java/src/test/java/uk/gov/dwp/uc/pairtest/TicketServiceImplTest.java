package uk.gov.dwp.uc.pairtest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import thirdparty.paymentgateway.TicketPaymentService;
import thirdparty.seatbooking.SeatReservationService;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
final class TicketServiceImplTest {

    @Mock
    private TicketPaymentService ticketPaymentService;

    @Mock
    private SeatReservationService seatReservationService;

    private TicketService ticketService;

    @BeforeEach
    void setUp() {
        ticketService = new TicketServiceImpl(ticketPaymentService, seatReservationService);
    }

    @Test
    @DisplayName("Should process a single adult ticket purchase")
    void shouldProcessSingleAdultTicket() {
        final long accountId = 1L;
        final TicketTypeRequest adultRequest = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 1);

        ticketService.purchaseTickets(accountId, adultRequest);

        verify(seatReservationService).reserveSeat(accountId, 1);
        verify(ticketPaymentService).makePayment(accountId, 25);
    }

    @Test
    @DisplayName("Should process multiple adult tickets")
    void shouldProcessMultipleAdultTickets() {
        final long accountId = 2L;
        final TicketTypeRequest adultRequest = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 5);

        ticketService.purchaseTickets(accountId, adultRequest);

        verify(seatReservationService).reserveSeat(accountId, 5);
        verify(ticketPaymentService).makePayment(accountId, 125);
    }

    @Test
    @DisplayName("Should process adult and child tickets")
    void shouldProcessAdultAndChildTickets() {
        final long accountId = 3L;
        final TicketTypeRequest adultRequest = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 2);
        final TicketTypeRequest childRequest = new TicketTypeRequest(TicketTypeRequest.Type.CHILD, 3);

        ticketService.purchaseTickets(accountId, adultRequest, childRequest);

        verify(seatReservationService).reserveSeat(accountId, 5);
        verify(ticketPaymentService).makePayment(accountId, 95);
    }
}


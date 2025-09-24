package uk.gov.dwp.uc.pairtest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import thirdparty.paymentgateway.TicketPaymentService;
import thirdparty.seatbooking.SeatReservationService;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;
import uk.gov.dwp.uc.pairtest.domain.cost.TicketTypeCost;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

class TicketServiceImplTest {

  @Mock
  private TicketPaymentService paymentService;

  @Mock
  private SeatReservationService seatService;

  private TicketServiceImpl ticketService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this); // manually initialize @Mock
    ticketService = new TicketServiceImpl(paymentService, seatService);
  }


  /**
   * Check that both the payment and reservation services are called for a valid request
   */
  @Test
  void purchaseTickets_withValidRequests_callsPaymentAndReservation() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.ADULT, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.CHILD, 1);

    assertDoesNotThrow(() -> ticketService.purchaseTickets(1L, req1, req2));

    int expectedCost = 2 * TicketTypeCost.TICKET_COST.get(Type.ADULT)
        + 1 * TicketTypeCost.TICKET_COST.get(Type.CHILD);
    int expectedSeats = 2 + 1; // adult + child

    verify(paymentService).makePayment(1L, expectedCost);
    verify(seatService).reserveSeat(1L, expectedSeats);
  }


  /**
   * Check negative account id is rejected
   */
  @Test
  void purchaseTickets_withNegativeAccountId_throwsException() {
    TicketTypeRequest req = new TicketTypeRequest(Type.ADULT, 1);

    InvalidPurchaseException ex = assertThrows(
        InvalidPurchaseException.class,
        () -> ticketService.purchaseTickets(-1L, req)
    );
    assertEquals("Invalid account id (-1)", ex.getMessage());

    verifyNoInteractions(paymentService, seatService);
  }


  /**
   * Check zero account id is rejected
   */
  @Test
  void purchaseTickets_withZeroAccountId_throwsException() {
    TicketTypeRequest req = new TicketTypeRequest(Type.ADULT, 1);

    InvalidPurchaseException ex = assertThrows(
        InvalidPurchaseException.class,
        () -> ticketService.purchaseTickets(0L, req)
    );
    assertEquals("Invalid account id (0)", ex.getMessage());

    verifyNoInteractions(paymentService, seatService);
  }


  /**
   * Check invalid ticket requests are rejected
   */
  @Test
  void purchaseTickets_withInvalidTicketRequests_throwsException() {
    // Zero tickets triggers TicketRequestRules.validate failure
    TicketTypeRequest req = new TicketTypeRequest(Type.ADULT, 0);

    assertThrows(
        InvalidPurchaseException.class,
        () -> ticketService.purchaseTickets(1L, req)
    );

    verifyNoInteractions(paymentService, seatService);
  }
}

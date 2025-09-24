package uk.gov.dwp.uc.pairtest.domain.validator;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TicketRequestsValidatorImplTest {

  private final TicketRequestsValidatorImpl validator = new TicketRequestsValidatorImpl();

  /**
   * Test null ticket requests fails
   */
  @Test
  void validate_withNullRequests_throwsException() {
    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate((TicketTypeRequest[]) null));

    assertEquals("No ticket requests", ex.getMessage());
  }


  /**
   * Test no ticket requests fails
   */
  @Test
  void validate_withEmptyRequests_throwsException() {
    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, validator::validate);

    assertEquals("No ticket requests", ex.getMessage());
  }


  /**
   * Test a single ticket requests for 0 tickets fails
   */
  @Test
  void validate_withZeroTicketRequest_throwsException() {
    TicketTypeRequest req = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 0);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req));

    assertEquals("Ticket request was for zero tickets", ex.getMessage());
  }


  /**
   * Test multiple requests with a single ticket requests for 0 tickets fails
   */
  @Test
  void validate_withZeroTicketRequestMulti_throwsException() {
    TicketTypeRequest req1 = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 1);
    TicketTypeRequest req2 = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 1);
    TicketTypeRequest req3 = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 0);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req1, req2, req3));

    assertEquals("Ticket request was for zero tickets", ex.getMessage());
  }


  /**
   * Test a single requests for too many tickets fails
   */
  @Test
  void validate_withTooManyTickets_throwsException() {
    TicketTypeRequest req = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 26);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req));

    assertEquals("Tickets requested exceed maximum allowed (25)", ex.getMessage());
  }


  /**
   * Test multiple requests for too many tickets fails
   */
  @Test
  void validate_withTooManyTicketsMultiple_throwsException() {
    TicketTypeRequest req1 = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 10);
    TicketTypeRequest req2 = new TicketTypeRequest(TicketTypeRequest.Type.CHILD, 10);
    TicketTypeRequest req3 = new TicketTypeRequest(TicketTypeRequest.Type.INFANT, 10);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req1, req2, req3));

    assertEquals("Tickets requested exceed maximum allowed (25)", ex.getMessage());
  }


  /**
   * Test requests for more infant than adult tickets fails
   */
  @Test
  void validate_withMoreInfantsThanAdults_throwsException() {
    TicketTypeRequest req1 = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 1);
    TicketTypeRequest req2 = new TicketTypeRequest(TicketTypeRequest.Type.INFANT, 2);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req1, req2));

    assertEquals("Infant tickets requested (2) exceeds adults (1)", ex.getMessage());
  }


  /**
   * Test requests for child but no adult tickets fails
   */
  @Test
  void validate_withChildrenButNoAdults_throwsException() {
    TicketTypeRequest req = new TicketTypeRequest(TicketTypeRequest.Type.CHILD, 1);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req));

    assertEquals("At least one adult ticket must me ordered when ordering child or infant tickets", ex.getMessage());
  }


  /**
   * Test requests for infant but no adult tickets fails
   */
  @Test
  void validate_withInfantsButNoAdults_throwsException() {
    TicketTypeRequest req = new TicketTypeRequest(TicketTypeRequest.Type.INFANT, 1);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req));

    assertEquals("At least one adult ticket must me ordered when ordering child or infant tickets", ex.getMessage());
  }


  /**
   * Test requests for child and infant but no adult tickets fails
   */
  @Test
  void validate_withChildrenAndInfantsButNoAdults_throwsException() {
    TicketTypeRequest req1 = new TicketTypeRequest(TicketTypeRequest.Type.CHILD, 1);
    TicketTypeRequest req2 = new TicketTypeRequest(TicketTypeRequest.Type.INFANT, 1);

    InvalidPurchaseException ex =
        assertThrows(InvalidPurchaseException.class, () -> validator.validate(req1, req2));

    assertEquals("At least one adult ticket must me ordered when ordering child or infant tickets", ex.getMessage());
  }


  /**
   * Test only adult ticket requests is allowed
   */
  @Test
  void validate_withValidAdultOnlyTickets_passes() {
    TicketTypeRequest req = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 2);

    assertDoesNotThrow(() -> validator.validate(req));
  }


  /**
   * Test adult & child/infant ticket requests is allowed
   */
  @Test
  void validate_withAdultAndChildAndInfant_passes() {
    TicketTypeRequest req1 = new TicketTypeRequest(TicketTypeRequest.Type.ADULT, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(TicketTypeRequest.Type.CHILD, 3);
    TicketTypeRequest req3 = new TicketTypeRequest(TicketTypeRequest.Type.INFANT, 2);

    assertDoesNotThrow(() -> validator.validate(req1, req2, req3));
  }
}

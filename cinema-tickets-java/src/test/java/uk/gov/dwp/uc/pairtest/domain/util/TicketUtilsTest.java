package uk.gov.dwp.uc.pairtest.domain.util;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TicketUtilsTest {

  /**
   * Test counts "over" null ticket requests return 0
   */
  @Test
  void count_withNullRequests_returnsZero() {
    int result = TicketUtils.count(Type.ADULT, (TicketTypeRequest[]) null);
    assertEquals(0, result);
  }


  /**
   * Test counts "over" no ticket requests return 0
   */
  @Test
  void count_withEmptyRequests_returnsZero() {
    int result = TicketUtils.count(Type.CHILD);
    assertEquals(0, result);
  }


  /**
   * Test counts "over" a single ticket request
   */
  @Test
  void count_withSingleMatchingType_returnsCorrectCount() {
    TicketTypeRequest req = new TicketTypeRequest(Type.ADULT, 3);

    int result = TicketUtils.count(Type.ADULT, req);
    assertEquals(3, result);
  }


  /**
   * Test counts "over" a multiple ticket requests
   */
  @Test
  void count_withMultipleMatchingType_requests_returnsSum() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.CHILD, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.CHILD, 4);

    int result = TicketUtils.count(Type.CHILD, req1, req2);
    assertEquals(6, result);
  }


  /**
   * Test counts "over" a multiple ticket requests
   */
  @Test
  void count_withMixedTypes_onlyCountsSpecifiedType() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.ADULT, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.CHILD, 5);
    TicketTypeRequest req3 = new TicketTypeRequest(Type.INFANT, 7);

    int result = TicketUtils.count(Type.CHILD, req1, req2, req3);
    assertEquals(5, result);
  }


  /**
   * Test counts "over" a multiple ticket requests with no match
   */
  @Test
  void count_withNoMatchingType_returnsZero() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.ADULT, 1);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.ADULT, 2);

    int result = TicketUtils.count(Type.INFANT, req1, req2);
    assertEquals(0, result);
  }
}

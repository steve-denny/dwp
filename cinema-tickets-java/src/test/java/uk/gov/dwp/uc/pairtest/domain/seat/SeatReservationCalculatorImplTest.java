package uk.gov.dwp.uc.pairtest.domain.seat;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SeatReservationCalculatorImplTest {

  private final SeatReservationCalculatorImpl calculator = new SeatReservationCalculatorImpl();

  /**
   * Adults only
   */
  @Test
  void calculateSeats_withAdultsOnly_returnsAdultCount() {
    TicketTypeRequest req = new TicketTypeRequest(Type.ADULT, 3);

    int seats = calculator.calculateSeats(req);
    assertEquals(3, seats);
  }

  
  /**
   * Child only
   */
  @Test
  void calculateSeats_withChildrenOnly_returnsChildCount() {
    TicketTypeRequest req = new TicketTypeRequest(Type.CHILD, 2);

    int seats = calculator.calculateSeats(req);
    assertEquals(2, seats);
  }


  /**
   * Adults & child only
   */
  @Test
  void calculateSeats_withAdultsAndChildren_returnsSum() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.ADULT, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.CHILD, 4);

    int seats = calculator.calculateSeats(req1, req2);
    assertEquals(6, seats);
  }


  /**
   * Infants only (no seat)
   */
  @Test
  void calculateSeats_withInfantsOnly_returnsZero() {
    TicketTypeRequest req = new TicketTypeRequest(Type.INFANT, 5);

    int seats = calculator.calculateSeats(req);
    assertEquals(0, seats);
  }


  /**
   * Adults and infants (no seat for infants)
   */
  @Test
  void calculateSeats_withAdultsAndInfants_returnsAdultsOnly() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.ADULT, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.INFANT, 3);

    int seats = calculator.calculateSeats(req1, req2);
    assertEquals(2, seats);
  }


  /**
   * Adult, child and infants (no seat for infants)
   */
  @Test
  void calculateSeats_withMixedTypes_returnsAdultsPlusChildren() {
    TicketTypeRequest req1 = new TicketTypeRequest(Type.ADULT, 2);
    TicketTypeRequest req2 = new TicketTypeRequest(Type.CHILD, 3);
    TicketTypeRequest req3 = new TicketTypeRequest(Type.INFANT, 4);

    int seats = calculator.calculateSeats(req1, req2, req3);
    assertEquals(5, seats); // 2 adults + 3 children
  }
}

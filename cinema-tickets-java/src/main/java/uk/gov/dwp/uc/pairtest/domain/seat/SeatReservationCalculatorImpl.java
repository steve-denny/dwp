package uk.gov.dwp.uc.pairtest.domain.seat;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;
import uk.gov.dwp.uc.pairtest.domain.util.TicketUtils;
import uk.gov.dwp.uc.pairtest.provider.SeatReservationCalculator;

/**
 * Implementation that calculates the required seats based on the given business rules
 */
public class SeatReservationCalculatorImpl implements SeatReservationCalculator {

  @Override
  public int calculateSeats(TicketTypeRequest... ticketTypeRequests) {
    // Get the counts of various tickets requested
    // (We ignore infants as they sit on adults laps)
    int adult = TicketUtils.count(Type.ADULT, ticketTypeRequests);
    int child = TicketUtils.count(Type.CHILD, ticketTypeRequests);

    // TODO we assume the number of tickets is valid (>=0)
    // TODO we assume the number of adult tickets is sufficient for the infants
    // Calculate and return
    return adult + child;
  }
}

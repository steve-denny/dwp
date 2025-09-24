package uk.gov.dwp.uc.pairtest.provider;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;

/**
 * Seat reservation calculator
 * <p>
 * Calculates the number of seats that should be reserved for the given ticket requests
 */
public interface SeatReservationCalculator {

  /**
   * Calculate the number of seats that should be reserved for the given ticket requests
   *
   * @param ticketTypeRequests the ticket requests
   * @return the number of seats that should be reserved
   */
  int calculateSeats(TicketTypeRequest... ticketTypeRequests);
}

package uk.gov.dwp.uc.pairtest.domain.util;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;

import java.util.Arrays;

/**
 * Utilities
 */
public class TicketUtils {
  // Prevent instantiation
  private TicketUtils() {
  }


  /**
   * Count the number of tickets of a given type in the requests
   *
   * @param type     the type to count
   * @param requests the requests
   * @return a count of the number of tickets requested for the given type
   */
  public static int count(Type type, TicketTypeRequest... requests) {
    // Protect against null
    if (requests == null)
      return 0;

    // TODO we assume the number of tickets is valid (>=0)
    return Arrays.stream(requests)
        .filter(r -> r.getTicketType().equals(type))
        .mapToInt(TicketTypeRequest::getNoOfTickets)
        .sum();
  }
}

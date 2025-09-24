package uk.gov.dwp.uc.pairtest.provider;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;

/**
 * Ticket cost calculator
 * <p>
 * Calculates the cost of the tickets for the given ticket requests
 */
public interface TicketCostCalculator {

  /**
   * Calculates the cost of the tickets for the given ticket requests
   *
   * @param ticketTypeRequests the ticket requests
   * @return the cost of the tickets
   */
  int calculateCost(TicketTypeRequest... ticketTypeRequests);
}

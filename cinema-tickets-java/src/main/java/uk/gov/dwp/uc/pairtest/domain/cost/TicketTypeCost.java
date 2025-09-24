package uk.gov.dwp.uc.pairtest.domain.cost;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;

import java.util.Map;

/**
 * The cost of tickets
 * <p>
 * Typically, this would be stored else where (database etc.)
 */
public class TicketTypeCost {
  // Prevent instantiation
  private TicketTypeCost() {
  }

  /**
   * Ticket costs
   */
  public final static Map<TicketTypeRequest.Type, Integer> TICKET_COST = Map.of(
      Type.ADULT, 25,
      Type.CHILD, 15,
      Type.INFANT, 0
  );
}

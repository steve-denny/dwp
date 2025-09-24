package uk.gov.dwp.uc.pairtest.domain.cost;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;
import uk.gov.dwp.uc.pairtest.domain.util.TicketUtils;
import uk.gov.dwp.uc.pairtest.provider.TicketCostCalculator;

/**
 * Implementation of a cost calculator using the given ticket costs
 */
public class TicketCostCalculatorImpl implements TicketCostCalculator {
  @Override
  public int calculateCost(TicketTypeRequest... ticketTypeRequests) {
    // Get the counts of various tickets requested
    int adult = TicketUtils.count(Type.ADULT, ticketTypeRequests);
    int child = TicketUtils.count(Type.CHILD, ticketTypeRequests);
    int infant = TicketUtils.count(Type.INFANT, ticketTypeRequests);

    // TODO we assumed the number of tickets is always valid (>=0)
    // Calculate the cost and return
    return adult * TicketTypeCost.TICKET_COST.getOrDefault(Type.ADULT, 0)
        + child * TicketTypeCost.TICKET_COST.getOrDefault(Type.CHILD, 0)
        + infant * TicketTypeCost.TICKET_COST.getOrDefault(Type.INFANT, 0);
  }
}

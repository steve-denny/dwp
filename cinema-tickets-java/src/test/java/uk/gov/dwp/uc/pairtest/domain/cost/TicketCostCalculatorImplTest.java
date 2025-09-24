package uk.gov.dwp.uc.pairtest.domain.cost;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest.Type;
import uk.gov.dwp.uc.pairtest.provider.TicketCostCalculator;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TicketCostCalculatorImplTest {

  private final TicketCostCalculator calculator = new TicketCostCalculatorImpl();

  /**
   * Adult only
   */
  @Test
  void calculateCost_WithOnlyAdults() {
    TicketTypeRequest req = new TicketTypeRequest(Type.ADULT, 2);

    int cost = calculator.calculateCost(req);
    assertEquals(2 * TicketTypeCost.TICKET_COST.get(Type.ADULT), cost);
  }


  /**
   * Adult & child only
   */
  @Test
  void calculateCost_WithAdultsAndChildren() {
    TicketTypeRequest[] requests = {
        new TicketTypeRequest(Type.ADULT, 1),
        new TicketTypeRequest(Type.CHILD, 3)
    };

    int expected = 1 * TicketTypeCost.TICKET_COST.get(Type.ADULT)
        + 3 * TicketTypeCost.TICKET_COST.get(Type.CHILD);

    int cost = calculator.calculateCost(requests);
    assertEquals(expected, cost);
  }


  /**
   * Infant only
   */
  @Test
  void calculateCost_WithInfantsOnly() {
    TicketTypeRequest req = new TicketTypeRequest(Type.INFANT, 5);

    int cost = calculator.calculateCost(req);
    assertEquals(5 * TicketTypeCost.TICKET_COST.get(Type.INFANT), cost);
  }


  /**
   * Empty input
   */
  @Test
  void calculateCost_WithEmptyInput() {
    int cost = calculator.calculateCost();
    assertEquals(0, cost);
  }
}

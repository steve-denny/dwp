package uk.gov.dwp.uc.pairtest.factory;

import uk.gov.dwp.uc.pairtest.domain.cost.TicketCostCalculatorImpl;
import uk.gov.dwp.uc.pairtest.provider.TicketCostCalculator;

/**
 * Ticket cost calculator factory
 */
public class TicketCostCalculatorFactory {

  // Prevent instantiation
  private TicketCostCalculatorFactory() {
  }

  /**
   * Factory
   *
   * @return a ticket cost calculator
   */
  public static TicketCostCalculator getTicketCostProvider() {
    // TODO some logic to read configuration and choose the provider to use
    return new TicketCostCalculatorImpl();
  }
}

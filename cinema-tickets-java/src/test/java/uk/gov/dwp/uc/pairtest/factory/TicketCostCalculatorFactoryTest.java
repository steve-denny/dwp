package uk.gov.dwp.uc.pairtest.factory;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.cost.TicketCostCalculatorImpl;
import uk.gov.dwp.uc.pairtest.provider.TicketCostCalculator;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class TicketCostCalculatorFactoryTest {

  /**
   * Check the correct implementation is returned
   */
  @Test
  void getTicketCostProvider_ReturnsTicketCostCalculatorImpl() {
    TicketCostCalculator calculator = TicketCostCalculatorFactory.getTicketCostProvider();
    assertInstanceOf(TicketCostCalculatorImpl.class, calculator);
  }
}

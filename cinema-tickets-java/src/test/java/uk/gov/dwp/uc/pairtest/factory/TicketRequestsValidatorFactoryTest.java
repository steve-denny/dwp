package uk.gov.dwp.uc.pairtest.factory;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.validator.TicketRequestsValidatorImpl;
import uk.gov.dwp.uc.pairtest.provider.TicketRequestsValidator;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class TicketRequestsValidatorFactoryTest {

  /**
   * Check the correct implementation is returned
   */
  @Test
  void getTicketRequestsValidator_ReturnsTicketRequestsValidatorImpl() {
    TicketRequestsValidator validator = TicketRequestsValidatorFactory.getTicketRequestsValidator();
    assertInstanceOf(TicketRequestsValidatorImpl.class, validator);
  }
}

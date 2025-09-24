package uk.gov.dwp.uc.pairtest.factory;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.domain.validator.AccountValidatorImpl;
import uk.gov.dwp.uc.pairtest.provider.AccountValidator;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class AccountValidatorFactoryTest {

  /**
   * Check the correct implementation is returned
   */
  @Test
  void getTicketRequestsValidator_ReturnsTicketRequestsValidatorImpl() {
    AccountValidator validator = AccountValidatorFactory.getAccountValidator();
    assertInstanceOf(AccountValidatorImpl.class, validator);
  }
}

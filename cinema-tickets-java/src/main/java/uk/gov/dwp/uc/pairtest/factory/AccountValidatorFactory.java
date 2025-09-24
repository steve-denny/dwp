package uk.gov.dwp.uc.pairtest.factory;

import uk.gov.dwp.uc.pairtest.domain.validator.AccountValidatorImpl;
import uk.gov.dwp.uc.pairtest.provider.AccountValidator;

/**
 * Account validator factory
 */
public class AccountValidatorFactory {

  // Prevent instantiation
  private AccountValidatorFactory() {
  }

  /**
   * Factory
   *
   * @return an account validator
   */
  public static AccountValidator getAccountValidator() {
    // TODO some logic to read configuration and choose the provider to use
    return new AccountValidatorImpl();
  }
}

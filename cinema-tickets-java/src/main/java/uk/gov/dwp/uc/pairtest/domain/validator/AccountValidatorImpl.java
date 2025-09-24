package uk.gov.dwp.uc.pairtest.domain.validator;

import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;
import uk.gov.dwp.uc.pairtest.provider.AccountValidator;

public class AccountValidatorImpl implements AccountValidator {

  @Override
  public void validate(long accountId) throws InvalidPurchaseException {
    // Anything with an id >0 is valid
    if (accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account id (%d)", accountId);
    }
  }
}

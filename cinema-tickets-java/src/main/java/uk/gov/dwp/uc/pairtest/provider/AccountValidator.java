package uk.gov.dwp.uc.pairtest.provider;

import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

/**
 * Account Id validator
 * <p>
 * Validates the given account id
 */
public interface AccountValidator {

  /**
   * Validate the given account id
   * Simply returns if the account id is valid or throws an appropriate exception
   *
   * @param accountId the account id
   * @throws InvalidPurchaseException if the account id is considered invalid
   */
  void validate(long accountId) throws InvalidPurchaseException;
}

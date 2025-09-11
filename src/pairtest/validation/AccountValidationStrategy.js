import ValidationStrategy from './ValidationStrategy.js';
import InvalidPurchaseException from '../lib/InvalidPurchaseException.js';
import { ERROR_MESSAGES } from '../constants/TicketConstants.js';

/**
 * Validation strategy for account ID validation.
 * 
 * @class AccountValidationStrategy
 * @extends {ValidationStrategy}
 */
export default class AccountValidationStrategy extends ValidationStrategy {
  /**
   * Validates that the account ID is a positive integer.
   * 
   * @param {ValidationContext} context - The validation context containing account ID
   * @throws {InvalidPurchaseException} When account ID is invalid
   */
  validate(context) {
    const accountId = context.getAccountId();
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNT_ID);
    }
  }
}

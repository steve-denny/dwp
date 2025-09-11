/**
 * Custom exception thrown when ticket purchase validation fails.
 * 
 * This exception is thrown when business rules are violated during
 * ticket purchase operations, such as invalid account IDs, ticket
 * quantity limits, or dependency rules.
 * 
 * @class InvalidPurchaseException
 * @extends {Error}
 */
export default class InvalidPurchaseException extends Error {
    /**
     * Creates a new InvalidPurchaseException instance.
     * 
     * @param {string} message - The error message describing the validation failure
     * @example
     * throw new InvalidPurchaseException("Account ID must be a positive integer");
     */
    constructor(message) {
        super(message);
        this.name = 'InvalidPurchaseException';
    }
}

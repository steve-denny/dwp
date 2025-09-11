/**
 * Abstract base class for validation strategies.
 * 
 * @abstract
 * @class ValidationStrategy
 */
export default class ValidationStrategy {
  /**
   * Validates the given context.
   * 
   * @abstract
   * @param {*} context - The context to validate
   * @throws {Error} When validation fails
   */
  validate(context) {
    throw new Error('ValidationStrategy.validate() must be implemented by subclass');
  }
}

import ValidationStrategy from './ValidationStrategy.js';
import ValidationContext from './ValidationContext.js';

/**
 * Orchestrates multiple validation strategies using a validation context.
 * 
 * @class ValidationOrchestrator
 */
export default class ValidationOrchestrator {
  #strategies;

  /**
   * Creates a new ValidationOrchestrator instance.
   * 
   * @param {ValidationStrategy[]} strategies - Array of validation strategies
   */
  constructor(strategies = []) {
    this.#strategies = strategies;
  }

  /**
   * Adds a validation strategy to the orchestrator.
   * 
   * @param {ValidationStrategy} strategy - The validation strategy to add
   */
  addStrategy(strategy) {
    if (!(strategy instanceof ValidationStrategy)) {
      throw new Error('Strategy must be an instance of ValidationStrategy');
    }
    this.#strategies.push(strategy);
  }

  /**
   * Validates the given context using all registered strategies.
   * 
   * @param {ValidationContext} context - The validation context to validate
   * @throws {Error} When any validation strategy fails
   */
  validate(context) {
    if (!(context instanceof ValidationContext)) {
      throw new Error('Context must be an instance of ValidationContext');
    }

    for (const strategy of this.#strategies) {
      strategy.validate(context);
    }
  }

  /**
   * Gets the number of registered strategies.
   * 
   * @returns {number} Number of strategies
   */
  getStrategyCount() {
    return this.#strategies.length;
  }
}

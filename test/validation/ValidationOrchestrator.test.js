import ValidationOrchestrator from '../../src/pairtest/validation/ValidationOrchestrator.js';
import ValidationStrategy from '../../src/pairtest/validation/ValidationStrategy.js';
import ValidationContext from '../../src/pairtest/validation/ValidationContext.js';

// Mock strategy for orchestration tests
class MockValidationStrategy extends ValidationStrategy {
  constructor({ shouldThrow = false, error = new Error('Validation failed') } = {}) {
    super();
    this.shouldThrow = shouldThrow;
    this.error = error;
    this.validateCallCount = 0;
  }
  validate(context) {
    this.validateCallCount++;
    if (this.shouldThrow) {
      throw this.error;
    }
    return context;
  }
}

describe('ValidationOrchestrator', () => {
  test('starts with zero strategies by default', () => {
    const orchestrator = new ValidationOrchestrator();
    expect(orchestrator.getStrategyCount()).toBe(0);
  });

  test('constructs with provided strategies', () => {
    const s1 = new MockValidationStrategy();
    const s2 = new MockValidationStrategy();
    const orchestrator = new ValidationOrchestrator([s1, s2]);
    expect(orchestrator.getStrategyCount()).toBe(2);
  });

  test('addStrategy only accepts ValidationStrategy instances', () => {
    const orchestrator = new ValidationOrchestrator();
    const s1 = new MockValidationStrategy();
    orchestrator.addStrategy(s1);
    expect(orchestrator.getStrategyCount()).toBe(1);
    expect(() => orchestrator.addStrategy({})).toThrow('Strategy must be an instance of ValidationStrategy');
  });

  test('validate calls each strategy in order with context', () => {
    const s1 = new MockValidationStrategy();
    const s2 = new MockValidationStrategy();
    const orchestrator = new ValidationOrchestrator([s1, s2]);
    const context = new ValidationContext(1, [], 0);
    expect(() => orchestrator.validate(context)).not.toThrow();
    expect(s1.validateCallCount).toBe(1);
    expect(s2.validateCallCount).toBe(1);
  });

  test('validate throws when a strategy throws and stops subsequent strategies', () => {
    const s1 = new MockValidationStrategy({ shouldThrow: true, error: new Error('boom') });
    const s2 = new MockValidationStrategy();
    const orchestrator = new ValidationOrchestrator([s1, s2]);
    const context = new ValidationContext(1, [], 0);
    expect(() => orchestrator.validate(context)).toThrow('boom');
    expect(s1.validateCallCount).toBe(1);
    expect(s2.validateCallCount).toBe(0);
  });


});



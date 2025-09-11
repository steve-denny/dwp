import ValidationStrategy from '../../src/pairtest/validation/ValidationStrategy.js';

describe('ValidationStrategy (abstract)', () => {
  test('validate should throw when not implemented', () => {
    const strategy = new ValidationStrategy();
    expect(() => strategy.validate({})).toThrow('ValidationStrategy.validate() must be implemented by subclass');
  });

  test('subclass should override validate', () => {
    class TestStrategy extends ValidationStrategy {
      validate(context) {
        return !!context;
      }
    }
    const strategy = new TestStrategy();
    expect(strategy.validate({ a: 1 })).toBe(true);
  });
});



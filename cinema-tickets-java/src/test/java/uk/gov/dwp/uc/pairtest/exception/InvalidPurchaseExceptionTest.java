package uk.gov.dwp.uc.pairtest.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;

class InvalidPurchaseExceptionTest {

  /**
   * Test a simple message is formatted correctly
   */
  @Test
  void constructor_withSimpleMessage_formatsCorrectly() {
    InvalidPurchaseException ex = new InvalidPurchaseException("Basic message");
    assertEquals("Basic message", ex.getMessage());
  }


  /**
   * Test a message with arguments is formatted correctly
   */
  @Test
  void constructor_withFormatArguments_insertsValues() {
    InvalidPurchaseException ex = new InvalidPurchaseException(
        "Too many tickets: %d requested, max %d",
        30, 25
    );
    assertEquals("Too many tickets: 30 requested, max 25", ex.getMessage());
  }


  /**
   * Test the exception is a runtime exception
   */
  @Test
  void exception_isRuntimeException() {
    InvalidPurchaseException ex = new InvalidPurchaseException("error");
    assertInstanceOf(RuntimeException.class, ex);
  }


  /**
   * Test the exception can be caught
   */
  @Test
  void exceptionThrown_canBeCaught() {
    assertThrows(InvalidPurchaseException.class, () -> {
      throw new InvalidPurchaseException("Failure %s", "case");
    });
  }
}

package uk.gov.dwp.uc.pairtest.domain.validator;

import org.junit.jupiter.api.Test;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AccountValidatorImplTest {

  private final AccountValidatorImpl validator = new AccountValidatorImpl();

  /**
   * Test positive ids are ok
   */
  @Test
  void validate_WithPositiveId_DoesNotThrow() {
    assertDoesNotThrow(() -> validator.validate(12345L));
  }


  /**
   * Test zero ids are not
   */
  @Test
  void validate_WithZero_ThrowsInvalidPurchaseException() {
    InvalidPurchaseException ex = assertThrows(
        InvalidPurchaseException.class,
        () -> validator.validate(0)
    );
    assertEquals("Invalid account id (0)", ex.getMessage());
  }


  /**
   * Test negative ids are not
   */
  @Test
  void validate_WithNegativeId_ThrowsInvalidPurchaseException() {
    InvalidPurchaseException ex = assertThrows(
        InvalidPurchaseException.class,
        () -> validator.validate(-42)
    );
    assertEquals("Invalid account id (-42)", ex.getMessage());
  }
}

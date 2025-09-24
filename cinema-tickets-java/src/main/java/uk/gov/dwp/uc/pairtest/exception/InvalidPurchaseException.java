package uk.gov.dwp.uc.pairtest.exception;

/**
 * General exception
 */
public class InvalidPurchaseException extends RuntimeException {
  /**
   * Constructor
   * Generates an exception using a formatted string for the message
   *
   * @param format the format
   * @param args   the arguments
   */
  public InvalidPurchaseException(String format, Object... args) {
    super(String.format(format, args));
  }
}

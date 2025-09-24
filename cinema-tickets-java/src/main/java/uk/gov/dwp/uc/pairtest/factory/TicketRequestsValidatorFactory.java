package uk.gov.dwp.uc.pairtest.factory;

import uk.gov.dwp.uc.pairtest.domain.validator.TicketRequestsValidatorImpl;
import uk.gov.dwp.uc.pairtest.provider.TicketRequestsValidator;

/**
 * Ticket requests validator factory
 */
public class TicketRequestsValidatorFactory {

  // Prevent instantiation
  private TicketRequestsValidatorFactory() {
  }

  /**
   * Factory
   *
   * @return a ticket requests validator
   */
  public static TicketRequestsValidator getTicketRequestsValidator() {
    // TODO some logic to read configuration and choose the provider to use
    return new TicketRequestsValidatorImpl();
  }
}

package uk.gov.dwp.uc.pairtest.provider;

import uk.gov.dwp.uc.pairtest.domain.TicketTypeRequest;
import uk.gov.dwp.uc.pairtest.exception.InvalidPurchaseException;

/**
 * Ticket request validator
 * <p>
 * Validates the given ticket requests
 */
public interface TicketRequestsValidator {

  /**
   * Validate the given ticket requests
   * Simply returns if the requests are valid or throws an appropriate exception
   *
   * @param ticketTypeRequests the ticket requests
   * @throws InvalidPurchaseException if the requests are considered invalid
   */
  void validate(TicketTypeRequest... ticketTypeRequests) throws InvalidPurchaseException;
}
